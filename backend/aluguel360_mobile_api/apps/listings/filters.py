import django_filters
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point

from .models import Listing


class ListingFilter(django_filters.FilterSet):
    tipo = django_filters.CharFilter(field_name='property__tipo', lookup_expr='iexact')
    cidade = django_filters.CharFilter(field_name='property__cidade', lookup_expr='icontains')
    estado = django_filters.CharFilter(field_name='property__estado', lookup_expr='iexact')
    bairro = django_filters.CharFilter(field_name='property__bairro', lookup_expr='icontains')
    preco_min = django_filters.NumberFilter(field_name='aluguel', lookup_expr='gte')
    preco_max = django_filters.NumberFilter(field_name='aluguel', lookup_expr='lte')
    quartos_min = django_filters.NumberFilter(method='room_filter')
    banheiros_min = django_filters.NumberFilter(method='room_filter')
    garagem_min = django_filters.NumberFilter(method='room_filter')
    area_min = django_filters.NumberFilter(field_name='property__area_m2', lookup_expr='gte')
    area_max = django_filters.NumberFilter(field_name='property__area_m2', lookup_expr='lte')
    pets = django_filters.BooleanFilter(method='feature_filter')
    mobiliado = django_filters.BooleanFilter(method='feature_filter')
    portaria = django_filters.BooleanFilter(method='feature_filter')
    condominio_incluido = django_filters.BooleanFilter()
    iptu_incluido = django_filters.BooleanFilter()
    lat = django_filters.NumberFilter(method='nearby_filter')
    lng = django_filters.NumberFilter(method='nearby_filter')
    raio_km = django_filters.NumberFilter(method='nearby_filter')

    class Meta:
        model = Listing
        fields = []

    def room_filter(self, queryset, name, value):
        room_type = {'quartos_min': 'quartos', 'banheiros_min': 'banheiros', 'garagem_min': 'garagem'}[name]
        return queryset.filter(property__rooms__tipo=room_type, property__rooms__quantidade__gte=value).distinct()

    def feature_filter(self, queryset, name, value):
        return queryset.filter(**{f'property__features__{name}': value})

    def nearby_filter(self, queryset, name, value):
        lat, lng = self.data.get('lat'), self.data.get('lng')
        if name != 'lat' or lat in (None, '') or lng in (None, ''):
            return queryset
        point = Point(float(lng), float(lat), srid=4326)
        radius = float(self.data.get('raio_km', 5)) * 1000
        return queryset.filter(property__location__distance_lte=(point, radius)).annotate(distance=Distance('property__location', point)).order_by('distance')
