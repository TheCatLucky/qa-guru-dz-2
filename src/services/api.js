import { ChallengerService } from './challenger.service';
import { ChallengesService } from './challenges.service';
import { TodoListService } from './todoList.service';
import { TodoService } from './todo.service';
import { HeartbeatService } from './heartbeat.service';

export class Api {
  constructor(request) {
    this.request = request;
    this.challenger = new ChallengerService(request);
    this.challenges = new ChallengesService(request);
    this.todoList = new TodoListService(request);
    this.todo = new TodoService(request);
    this.heartbeat = new HeartbeatService(request);
  }
}
