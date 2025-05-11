import { Survey } from './survey.module';
import { User } from './user.module';

export class Group {
  $id: string;
  id: number;
  name: string;
  userGroups: GroupValues;
  surveysAssigned: SurveyValues;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  selected?: boolean;

  constructor(
    $id: string,
    id: number,
    name: string,
    userGroups?: GroupValues,
    surveysAssigned?: SurveyValues,
    lastUpdatedOn?: string,
    lastUpdatedBy?: number
  ) {
    this.$id = $id;
    this.id = id;
    this.name = name;
    this.userGroups = userGroups || { $id: '', $values: [] };
    this.surveysAssigned = surveysAssigned || { $id: '', $values: [] };
    this.lastUpdatedOn = lastUpdatedOn || '';
    this.lastUpdatedBy = lastUpdatedBy || 0;
  }
}

interface GroupValues {
  $id: string;
  $values: User[];
}

interface SurveyValues {
  $id: string;
  $values: Survey[];
}
