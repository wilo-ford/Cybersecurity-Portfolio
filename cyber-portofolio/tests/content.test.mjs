import test from 'node:test';
import assert from 'node:assert/strict';
import { profile, projects, skills, timeline } from '../src/content.js';
test('Les informations de contact et les liens publiés sont valides', () => {
  assert.match(profile.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  for (const url of [profile.github, profile.linkedin, ...projects.map(p => p.link)].filter(Boolean)) assert.equal(new URL(url).protocol, 'https:');
});
test('Chaque projet a un identifiant unique et une description explicite', () => {
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length);
  for (const p of projects) { assert.ok(p.detail.length > 80); assert.ok(p.role); assert.ok(p.tags.length); }
});
test('La présentation reste fidèle au parcours étudiant et aux niveaux réels', () => {
  assert.ok(profile.about.includes('Licence 3'));
  assert.ok(skills.every(s => s.label && s.text && s.tags.length));
  assert.equal(timeline.filter(t => t.current).length, 1);
  assert.ok(!JSON.stringify({profile, projects, skills}).match(/expert certifié|certification obtenue|clients satisfaits/i));
});
