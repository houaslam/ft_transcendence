# Generated by Django 5.1.1 on 2025-02-10 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profiles', '0004_profile_pic_updated'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='oauth2_id',
            field=models.IntegerField(blank=True, unique=True),
        ),
    ]
