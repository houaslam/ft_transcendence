# Generated by Django 4.2.15 on 2024-08-19 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0009_remove_player_game_game_player_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='player_id',
            field=models.IntegerField(),
        ),
    ]
