export interface IQuestionOwner {
  reputation: number;
  user_id: number;
  user_type: string;
  accept_rate?: number;
  profile_image: string;
  display_name: string;
  link: string;
}

export interface IQuestion {
  tags: string[];
  owner: IQuestionOwner;
  is_answered: boolean;
  accepted_answer_id?: number;
  view_count: number;
  answer_count: number;
  score: number;
  last_edit_date: any;
  last_activity_date: any;
  creation_date: any;
  question_id: number;
  link: string;
  title: string;
  body?: string;
}

export interface IResponceQuestion {
  items: IQuestion[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
}
