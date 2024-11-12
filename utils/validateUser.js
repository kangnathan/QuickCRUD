import prisma from '@/lib/prisma';
import isAlphaNumeric from '@/utils/isAlphaNumeric';
import validateEmail from '@/utils/validateEmail';

export async function validateUser(user) {
  const errors = {};

  user.name = user.name.trim();
  user.email = user.email.trim();
  user.password = user.password.trim();

  if (!user.name) {
    errors.name = 'You must provide a username.';
  } else if (user.name.length < 3) {
    errors.name = 'Username must be at least 3 characters.';
  } else if (user.name.length > 30) {
    errors.name = 'Username cannot exceed 30 characters.';
  } else if (!isAlphaNumeric(user.name)) {
    errors.name = 'Usernames can only contain letters, numbers, and spaces.';
  }

  const usernameInQuestion = await prisma.user.findFirst({
    where: { name: user.name },
  });
  if (usernameInQuestion) {
    errors.name = 'That username is already in use.';
  }

  if (!user.email) {
    errors.email = 'You must provide an email address.';
  } else if (!validateEmail(user.email)) {
    errors.email = 'Please provide a valid email address.';
  } else {
    const emailInQuestion = await prisma.user.findFirst({
      where: { email: user.email },
    });
    if (emailInQuestion) {
      errors.email = 'That email address is already in use.';
    }
  }

  if (!user.password) {
    errors.password = 'You must provide a password.';
  } else if (user.password.length < 12) {
    errors.password = 'Password must be at least 12 characters.';
  } else if (user.password.length > 50) {
    errors.password = 'Password cannot exceed 50 characters.';
  }

  return errors;
}
