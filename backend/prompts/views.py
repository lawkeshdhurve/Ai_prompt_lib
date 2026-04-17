import json
import redis
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError
from .models import Prompt
import os

redis_client = redis.Redis(
    host=os.environ.get('REDIS_HOST', 'localhost'),
    port=int(os.environ.get('REDIS_PORT', 6379)),
    decode_responses=True
)


def prompt_to_dict(prompt, view_count=None):
    data = {
        'id': str(prompt.id),
        'title': prompt.title,
        'content': prompt.content,
        'complexity': prompt.complexity,
        'created_at': prompt.created_at.isoformat(),
    }
    if view_count is not None:
        data['view_count'] = view_count
    return data


@method_decorator(csrf_exempt, name='dispatch')
class PromptListView(View):
    def get(self, request):
        prompts = Prompt.objects.all()
        data = [prompt_to_dict(p) for p in prompts]
        return JsonResponse(data, safe=False)

    def post(self, request):
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        title = body.get('title', '').strip()
        content = body.get('content', '').strip()
        complexity = body.get('complexity')

        errors = {}
        if len(title) < 3:
            errors['title'] = 'Title must be at least 3 characters.'
        if len(content) < 20:
            errors['content'] = 'Content must be at least 20 characters.'
        if complexity is None or not (1 <= int(complexity) <= 10):
            errors['complexity'] = 'Complexity must be between 1 and 10.'

        if errors:
            return JsonResponse({'errors': errors}, status=400)

        prompt = Prompt.objects.create(
            title=title,
            content=content,
            complexity=int(complexity)
        )
        return JsonResponse(prompt_to_dict(prompt), status=201)


@method_decorator(csrf_exempt, name='dispatch')
class PromptDetailView(View):
    def get(self, request, pk):
        try:
            prompt = Prompt.objects.get(pk=pk)
        except Prompt.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)

        redis_key = f'prompt:views:{pk}'
        view_count = redis_client.incr(redis_key)

        return JsonResponse(prompt_to_dict(prompt, view_count=view_count))
