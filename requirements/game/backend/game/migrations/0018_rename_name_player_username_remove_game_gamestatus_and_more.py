# Generated by Django 5.1.4 on 2024-12-14 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0017_player_game_result'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='name',
            new_name='username',
        ),
        migrations.RemoveField(
            model_name='game',
            name='gameStatus',
        ),
        migrations.RemoveField(
            model_name='game',
            name='player_count',
        ),
        migrations.RemoveField(
            model_name='game',
            name='settings',
        ),
        migrations.RemoveField(
            model_name='player',
            name='game_result',
        ),
        migrations.RemoveField(
            model_name='player',
            name='is_host',
        ),
        migrations.AddField(
            model_name='player',
            name='points',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='player',
            name='status',
            field=models.CharField(choices=[('W', 'Won'), ('L', 'Lost')], default='Won', max_length=4),
        ),
        migrations.AlterField(
            model_name='game',
            name='created_at',
            field=models.DateTimeField(auto_created=True),
        ),
    ]
