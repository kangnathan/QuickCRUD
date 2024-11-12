export default function isAlphaNumeric(x) {
  const regex = /^[a-zA-Z0-9\s]*$/
  return regex.test(x)
}