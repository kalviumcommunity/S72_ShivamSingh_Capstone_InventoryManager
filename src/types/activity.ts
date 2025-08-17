export type ActivityAction = 'create' | 'update' | 'delete' | 'login' | 'logout';
export type ResourceType = 'inventory' | 'user' | 'system' | 'category';

export interface ActivityLogType {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  resourceType: ResourceType;
  resourceId: string;
  resourceName: string;
  timestamp: string;
  details: string;
}