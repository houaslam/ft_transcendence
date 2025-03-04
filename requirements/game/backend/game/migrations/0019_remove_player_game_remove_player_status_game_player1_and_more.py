# Generated by Django 5.1.4 on 2024-12-14 15:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0018_rename_name_player_username_remove_game_gamestatus_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='game',
        ),
        migrations.RemoveField(
            model_name='player',
            name='status',
        ),
        migrations.AddField(
            model_name='game',
            name='player1',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player1_games', to='game.player'),
        ),
        migrations.AddField(
            model_name='game',
            name='player1_points',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='game',
            name='player2',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player2_games', to='game.player'),
        ),
        migrations.AddField(
            model_name='game',
            name='player2_points',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='game',
            name='winner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.player'),
        ),
        migrations.AddField(
            model_name='player',
            name='games',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='player',
            name='level',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='player',
            name='rank',
            field=models.IntegerField(default=0),
        ),
    ]
