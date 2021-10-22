# Generated by Django 3.2.5 on 2021-07-08 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_auto_20210707_1719'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='longitude',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='time_zone_offset',
        ),
        migrations.AddField(
            model_name='profile',
            name='location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='postal',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
