import { nanoid } from 'nanoid'
export default function uuid() {
  return nanoid(24) // طول دلخواه
}
