import { renderMissionBrief } from '../lib/mission-playbook';
import { missionPlaybook } from './mission-playbook';

/** A blank, learner-owned brief, transfer record and retrospective, generated from the playbook template. It contains no customer data or completed-work claims. */
export const missionBrief = renderMissionBrief(missionPlaybook.template, missionPlaybook.routes);
