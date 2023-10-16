interface Group {
  id: number;
  name: string;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  isPublished: boolean;
  surveysAssigned?: any;
}

interface GroupResponse {
  $id: string;
  $values: Group[];
}
