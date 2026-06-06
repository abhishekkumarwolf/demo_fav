from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0002_alter_guest_profile_image'),
    ]

    operations = [
        # Add state and max_guests to Property
        migrations.AddField(
            model_name='property',
            name='state',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='property',
            name='max_guests',
            field=models.PositiveSmallIntegerField(default=2),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['name'], name='properties_property_name_idx'),
        ),
        migrations.AddIndex(
            model_name='guest',
            index=models.Index(fields=['last_name', 'first_name'], name='properties_guest_name_idx'),
        ),

        # Create Reservation (the canonical model going forward)
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('check_in', models.DateField(db_index=True)),
                ('check_out', models.DateField(db_index=True)),
                ('status', models.CharField(
                    choices=[
                        ('confirmed', 'Confirmed'),
                        ('pending', 'Pending'),
                        ('cancelled', 'Cancelled'),
                        ('checked_out', 'Checked Out'),
                    ],
                    db_index=True,
                    default='confirmed',
                    max_length=20,
                )),
                ('price_per_night', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('total_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('source', models.CharField(blank=True, default='direct', max_length=50)),
                ('booking_link', models.URLField(blank=True, default='', max_length=500)),
                ('notes', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('property', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='reservations',
                    to='properties.property',
                )),
                ('guest', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='reservations',
                    to='properties.guest',
                )),
            ],
            options={
                'ordering': ['check_in'],
            },
        ),
        migrations.AddIndex(
            model_name='reservation',
            index=models.Index(fields=['property', 'check_in'], name='properties_reservation_prop_checkin_idx'),
        ),
        migrations.AddIndex(
            model_name='reservation',
            index=models.Index(fields=['property', 'status'], name='properties_reservation_prop_status_idx'),
        ),

        # Proxy model Booking → Reservation (keeps old FK references working)
        migrations.CreateModel(
            name='Booking',
            fields=[],
            options={
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('properties.reservation',),
        ),

        # Task model
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True, default='')),
                ('task_type', models.CharField(
                    choices=[
                        ('cleaning', 'Cleaning'),
                        ('maintenance', 'Maintenance'),
                        ('inspection', 'Inspection'),
                        ('other', 'Other'),
                    ],
                    default='cleaning',
                    max_length=20,
                )),
                ('priority', models.CharField(
                    choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')],
                    default='medium',
                    max_length=10,
                )),
                ('status', models.CharField(
                    choices=[('pending', 'Pending'), ('in_progress', 'In Progress'), ('done', 'Done')],
                    default='pending',
                    max_length=20,
                )),
                ('assigned_to', models.CharField(blank=True, default='', max_length=100)),
                ('due_date', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('property', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='tasks',
                    to='properties.property',
                )),
                ('reservation', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='tasks',
                    to='properties.reservation',
                )),
            ],
            options={'ordering': ['due_date', '-priority']},
        ),
        migrations.AddIndex(
            model_name='task',
            index=models.Index(fields=['property', 'status'], name='properties_task_prop_status_idx'),
        ),

        # Inquiry model
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guest_name', models.CharField(max_length=200)),
                ('email', models.EmailField(blank=True, default='')),
                ('phone', models.CharField(blank=True, default='', max_length=50)),
                ('message', models.TextField()),
                ('status', models.CharField(
                    choices=[('new', 'New'), ('replied', 'Replied'), ('archived', 'Archived')],
                    default='new',
                    max_length=20,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('property', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='inquiries',
                    to='properties.property',
                )),
            ],
            options={'ordering': ['-created_at'], 'verbose_name_plural': 'inquiries'},
        ),
    ]
