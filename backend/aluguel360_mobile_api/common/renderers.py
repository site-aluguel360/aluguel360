from rest_framework.renderers import JSONRenderer
import json


class StandardJsonRenderer(JSONRenderer):
    """
    Envolve TODAS as respostas no formato:
    { "success": true/false, "data": {}, "message": "" }
    
    Views de sucesso retornam apenas 'data'.
    O error handler cuida das respostas de erro.
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response')
        
        if response and response.status_code >= 400:
            # Erro: deixa o exception handler formatar
            return super().render(data, accepted_media_type, renderer_context)
        
        wrapped = {
            'success': True,
            'data': data,
        }
        return super().render(wrapped, accepted_media_type, renderer_context)
