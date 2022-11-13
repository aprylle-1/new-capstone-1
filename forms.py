from ast import Pass, Str
from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, PasswordField
from wtforms.validators import DataRequired, Length

class UserForm(FlaskForm):
    """Form for handling user creation/login"""

    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)]) #requires user to have a password that is at least 8 characters long