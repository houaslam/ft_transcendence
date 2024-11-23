# Generated by Django 4.2.15 on 2024-08-21 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0011_game_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='type',
            field=models.CharField(choices=[('TR', 'tournament'), ('MP', 'multiplayer'), ('VS', 'inviteFriend')], default='', max_length=2),
        ),
    ]