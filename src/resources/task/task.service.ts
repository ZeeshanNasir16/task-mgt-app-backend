import Task from '@/resources/task/task.interface';
import TaskModel from './task.model';
import validateObjectId from '@/utils/helpers/dbHelper';
import mongoose from 'mongoose';

class ProjService {
  private Task = TaskModel;

  public async addTask(body: Body): Promise<Task> {
    try {
      const task = await (
        await this.Task.create({ ...body })
      ).populate('assignedTo');
      return task;
    } catch (e: any) {
      throw new Error(`Unable to create Task : ${e.message}`);
    }
  }

  public async getAllTasks(): Promise<Task[] | null> {
    try {
      const tasks = await this.Task.find();
      return tasks;
    } catch (e: any) {
      throw new Error(`Unable to get tasks : ${e.message}`);
    }
  }

  public async getTask(id: string): Promise<Task | null> {
    try {
      const task = await this.Task.findById(id);
      return task;
    } catch (e: any) {
      throw new Error(`Unable to get task of id ${id} : ${e.message}`);
    }
  }

  public async updateTask(id: string, body: Body): Promise<Task | null> {
    try {
      validateObjectId(id);

      const updTask = await this.Task.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      return updTask;
    } catch (e: any) {
      throw new Error(`Unable to get task : ${e.message}`);
    }
  }

  public async deleteTask(id: string): Promise<Task | null> {
    try {
      const task = await this.Task.findByIdAndDelete(id);
      return task;
    } catch (e: any) {
      throw new Error(`Unable to get task of id ${id} : ${e.message}`);
    }
  }

  public async random(id: string): Promise<any | null> {
    try {
      var position = new mongoose.Types.ObjectId(id);
      const tasks = await this.Task.aggregate([
        { $match: { 'assignedTo.user': position } },
        {
          $group: {
            _id: '$status',
            items: {
              $push: {
                id: '$_id',
                title: '$title',
                description: '$description',
                deadLine: '$deadLine',
              },
            },
          },
        },
      ]);
      return tasks;
    } catch (e: any) {
      throw new Error(`Unable to get tasks : ${e.message}`);
    }
  }
}

export default ProjService;
