# Generated by Django 5.1.4 on 2024-12-14 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0021_alter_game_date_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='date_time',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
