export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: {
    id: number;
    name: string;
  };
}

export interface CreateTodoPayload {
  text: string;
  categoryId: number;
}

export interface UpdateTodoPayload {
  completed: boolean;
}
