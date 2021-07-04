import {
  BadRequestException,
  Dependencies,
  HttpService,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";

@Injectable()
export class GithubService {

  private readonly gitToken = process.env.GITHUB_TOKEN
  private readonly gitHubAPI = 'https://api.github.com/'

  constructor(
    private readonly httpService: HttpService
  ) {}

  async getRepoInfo(repo_url: string) {
    const repoAndAuthor = this.getRepoAndAuthorFromURL(repo_url);
    try {
      const req = await this.httpService.get(this.gitHubAPI+`repos/${repoAndAuthor.author}/${repoAndAuthor.repo}`,{
        headers: {
          "Authorization": `token ${this.gitToken}`
        }
      }).toPromise()
      return req.data;
    } catch (e) {
      throw new BadRequestException({
        message: "This GitRepo seems Not be found on Github"
      })
    }
  }

  async createWebhook(repo_url,project_id: number) : Promise<string> {
    const repoAndAuthor = this.getRepoAndAuthorFromURL(repo_url);

    const hookInfo = {
      config: {
        url: `${process.env.APP_URL}/worker/trigger/${project_id}`,
        content_type: 'json',
        insecure_ssl: 1,
        active: true,
        events: ['push'],
      }
    }
    try {
      const req = await this.httpService.post(`${this.gitHubAPI}repos/${repoAndAuthor.author}/${repoAndAuthor.repo}/hooks`,
        hookInfo, {
        headers: {
          "Authorization": `token ${this.gitToken}`
        }
      }).toPromise();
      return hookInfo.config.url;
    } catch (e) {
      console.log(e.response);
      throw new InternalServerErrorException({
        code: 500,
        message: "Unable To Create a Webhook",
        data: {
          error: e.response
        }
      })
    }
  }

  getRepoAndAuthorFromURL(repo_url:string) {
    let repo = repo_url.replace('git@github.com:','');
    repo = repo.replace('https://github.com/','')
    repo = repo.replace('http://github.com/','')
    if (repo.split('/').length < 2)
      throw new BadRequestException({
        message: "Repo URL Is Incorrect"
      })
    return {
      author: repo.split('/')[0],
      repo: repo.split('/')[1]
    }
  }

}
