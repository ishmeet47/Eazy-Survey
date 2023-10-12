interface Group {
  id: number;
  name: string;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  isPublished: boolean;
  surveysAssigned?: any; // If more detail is known, this type can be refined
}

interface GroupResponse {
  $id: string;
  $values: Group[];
}
