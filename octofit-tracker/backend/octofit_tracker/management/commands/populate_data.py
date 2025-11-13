from django.core.management.base import BaseCommand
from octofit_tracker.models import Team, User, Activity, Workout, Leaderboard


class Command(BaseCommand):
    help = 'Populates the database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create teams
        team1, _ = Team.objects.get_or_create(name='Team Thunder')
        team2, _ = Team.objects.get_or_create(name='Team Lightning')
        team3, _ = Team.objects.get_or_create(name='Team Storm')
        
        self.stdout.write(self.style.SUCCESS(f'Created {Team.objects.count()} teams'))

        # Create sample workouts
        workouts_data = [
            {
                'name': 'Morning Run',
                'description': 'Start your day with a 5km morning run',
                'duration': 30
            },
            {
                'name': 'HIIT Training',
                'description': 'High-intensity interval training for maximum calorie burn',
                'duration': 20
            },
            {
                'name': 'Yoga Flow',
                'description': 'Relaxing yoga session for flexibility and mindfulness',
                'duration': 45
            },
            {
                'name': 'Strength Training',
                'description': 'Full body strength workout with weights',
                'duration': 60
            },
            {
                'name': 'Cycling Adventure',
                'description': '20km cycling route through scenic paths',
                'duration': 50
            },
        ]

        for workout_data in workouts_data:
            Workout.objects.get_or_create(**workout_data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {Workout.objects.count()} workouts'))

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
