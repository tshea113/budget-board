# models.py

from werkzeug.security import generate_password_hash, check_password_hash
from . import db

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    confirmed_at = db.Column(db.DateTime())

    def __init__(self, first_name, last_name, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = generate_password_hash(password, method='sha256')

    @classmethod
    def authenticate(cls, **kwargs):
        email = kwargs.get('email')
        password = kwargs.get('password')

        if not email or not password:
            return None

        user = cls.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return None

        return user

    def to_dict(self):
        return dict(user_id=self.user_id, email=self.email, first_name=self.first_name, last_name=self.last_name)

# class Exercise(db.Model):
#     exercise_id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
#     user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
#     name = db.Column(db.String(50), unique=True)
#     group = db.Column(db.String(50))
#     user = db.relationship("User", back_populates="exercises")
#     workouts = db.relationship("Workout", secondary="workout_exercise")

#     def to_dict(self):
#         return dict(user_id=self.user_id, name=self.name, group=self.group)

#     @property
#     def serialize(self):
#        """Return object data in easily serializable format"""
#        return {
#            'exercise_id' : self.exercise_id,
#            'user_id' : self.user_id,
#            'name' : self.name,
#            'group' : self.group,
#        }
