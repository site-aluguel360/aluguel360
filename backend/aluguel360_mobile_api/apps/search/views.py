from django.db.models import Q
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.listings.models import Listing, ListingStatus
from apps.listings.serializers import ListingListSerializer


class SearchView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ListingListSerializer

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'results': []})
        listings = Listing.objects.filter(status=ListingStatus.PUBLICADO).filter(
            Q(titulo__icontains=query) | Q(descricao__icontains=query) | Q(property__cidade__icontains=query)
        ).select_related('property')[:20]
        return Response({'results': ListingListSerializer(listings, many=True, context={'request': request}).data})
