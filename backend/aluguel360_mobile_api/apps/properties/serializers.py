from rest_framework import serializers

from .models import Property, PropertyRoom


class PropertyRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyRoom
        fields = ['id', 'tipo', 'quantidade']
        read_only_fields = ['id']


class PropertySerializer(serializers.ModelSerializer):
    tipo = serializers.CharField(required=False, default='OUTRO')
    area_m2 = serializers.FloatField(required=False, default=0)
    cep = serializers.CharField(required=False, default='')
    logradouro = serializers.CharField(required=False, default='')
    numero = serializers.CharField(required=False, default='')
    bairro = serializers.CharField(required=False, default='')
    cidade = serializers.CharField(required=False, default='')
    estado = serializers.CharField(required=False, default='')
    complemento = serializers.CharField(required=False, default='')
    referencia = serializers.CharField(required=False, default='')
    features = serializers.JSONField(required=False, default=dict)
    rooms = PropertyRoomSerializer(many=True, required=False)

    class Meta:
        model = Property
        fields = ['id', 'tipo', 'area_m2', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'complemento', 'referencia', 'features', 'status', 'rooms', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        rooms = validated_data.pop('rooms', [])
        prop = Property.objects.create(owner=self.context['request'].user, **validated_data)
        PropertyRoom.objects.bulk_create([PropertyRoom(property=prop, **room) for room in rooms])
        return prop

    def update(self, instance, validated_data):
        rooms = validated_data.pop('rooms', None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        if rooms is not None:
            instance.rooms.all().delete()
            PropertyRoom.objects.bulk_create([PropertyRoom(property=instance, **room) for room in rooms])
        return instance
