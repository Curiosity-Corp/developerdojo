import { z } from 'zod';

/** Field entries describe areas for exploration, not claims that katas or qualifications exist. */
const fieldSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1),
  examples: z.string().trim().min(1),
  trackHref: z.string().regex(/^\/library\/tracks\/[a-z0-9-]+$/).optional(),
});
export const fieldsSchema = z.array(fieldSchema).min(1).superRefine((fields, ctx) => {
  const seen = new Set<string>();
  fields.forEach((field, index) => {
    if (seen.has(field.id)) ctx.addIssue({ code: 'custom', path: [index, 'id'], message: 'field IDs must be unique' });
    seen.add(field.id);
  });
});

export const fields = fieldsSchema.parse([
  { id: 'software', name: 'Software and digital products', examples: 'Applications, services, platforms and automation.', trackHref: '/library/tracks/phantoms-stack' },
  { id: 'ux', name: 'UX and product design', examples: 'Journeys, wireframes, design systems and interactive prototypes.', trackHref: '/library/tracks/brand-website-and-mockups' },
  { id: '3d', name: '3D and spatial design', examples: 'Editable models, visualizations and spatial experiences.' },
  { id: 'architecture-bim', name: 'Architecture and BIM', examples: 'Building models, information exchange and coordination.' },
  { id: 'construction', name: 'Construction and infrastructure', examples: 'Coordination, quantities, schedules and asset information.' },
  { id: 'manufacturing', name: 'Manufacturing and product design', examples: 'Components, assemblies, production planning and quality evidence.' },
  { id: 'robotics', name: 'Robotics and autonomy', examples: 'Simulations, robot workflows, sensing and controls.' },
  { id: 'aerospace', name: 'Aerospace and transport', examples: 'Design models, simulation and maintenance workflows.' },
  { id: 'energy', name: 'Energy and environment', examples: 'Asset monitoring, analysis and planning.' },
  { id: 'health', name: 'Health and life sciences', examples: 'Research workflows, analysis and health information.' },
  { id: 'science', name: 'Science and research', examples: 'Research questions, reproducible analyses and models.', trackHref: '/library/tracks/research-and-evidence' },
  { id: 'agriculture', name: 'Agriculture and natural resources', examples: 'Field data, planning and resource analysis.' },
  { id: 'finance', name: 'Finance and operations', examples: 'Financial analysis, reports and business workflows.' },
  { id: 'education', name: 'Education and learning', examples: 'Learning experiences, materials and assessment design.' },
  { id: 'media', name: 'Media and communications', examples: 'Video, images, writing, presentations and campaigns.' },
  { id: 'data', name: 'Data and analytics', examples: 'Data products, analysis and visualization.' },
  { id: 'cybersecurity', name: 'Cybersecurity', examples: 'Threat analysis, safeguards and security review.', trackHref: '/library/tracks/security-fundamentals' },
  { id: 'public-service', name: 'Public service and legal operations', examples: 'Service workflows, research and public information.' },
]);
