import Project from '@/resources/project/Project.interface';
import ProjectModel from './project.model';
import validateObjectId from '@/utils/helpers/dbHelper';

class ProjService {
  private Project = ProjectModel;

  public async addProj(body: Body): Promise<Project> {
    try {
      const proj = await this.Project.create({ ...body });
      return proj;
    } catch (e: any) {
      throw new Error(`Unable to create Project : ${e.message}`);
    }
  }

  public async getAllProj(): Promise<Project[] | null> {
    try {
      const projs = await this.Project.find();
      return projs;
    } catch (e: any) {
      throw new Error(`Unable to get projects : ${e.message}`);
    }
  }

  public async getProject(id: string): Promise<Project | null> {
    try {
      const proj = await this.Project.findById(id);
      return proj;
    } catch (e: any) {
      throw new Error(`Unable to get project of id ${id} : ${e.message}`);
    }
  }

  public async updateProject(id: string, body: Body): Promise<Project | null> {
    try {
      validateObjectId(id);

      const updProj = await this.Project.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      return updProj;
    } catch (e: any) {
      throw new Error(`Unable to get project : ${e.message}`);
    }
  }

  public async deleteProj(id: string): Promise<Project | null> {
    try {
      const proj = await this.Project.findByIdAndDelete(id);
      return proj;
    } catch (e: any) {
      throw new Error(`Unable to get project of id ${id} : ${e.message}`);
    }
  }
}

export default ProjService;
