import eventsJson from '../data/events.json';
import challengesJson from '../data/challenges.json';
import certificatesJson from '../data/certificates.json';
import {
  certificatesSchema,
  challengesSchema,
  eventsSchema,
  type Certificate,
  type Challenge,
  type DojoEvent,
} from './schemas';

/** Parsed and validated at build time: a malformed data file fails the build with a readable error. */
export function getEvents(): DojoEvent[] {
  return eventsSchema.parse(eventsJson).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

export function getChallenges(): Challenge[] {
  return challengesSchema.parse(challengesJson);
}

export function getCertificates(): Certificate[] {
  return certificatesSchema.parse(certificatesJson);
}
