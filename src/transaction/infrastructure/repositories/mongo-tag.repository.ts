import { NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectionConfig } from 'injection-config'
import { Model } from 'mongoose'
import { Tag } from 'transaction/domain/tag'
import { TagRepository } from 'transaction/domain/tag.repository'
import { TagMapper } from '../mappers/tag.mapper'
import { TagDocument } from '../schemas/tag.schema'

export class MongoTagRepository implements TagRepository {
  public constructor(
    @InjectModel(InjectionConfig.TAG_MODEL)
    private readonly tagModel: Model<TagDocument>,
    private readonly tagMapper: TagMapper,
  ) {}
  public async createOne(name: string): Promise<void> {
    await this.tagModel.create({ name, active: true })
  }

  public async removeTag(id: string): Promise<void> {
    const tag = await this.tagModel.findByIdAndUpdate(id, { active: false })
    if (!tag) {
      throw new NotFoundException('Tag not found')
    }
  }

  public async findAll(): Promise<Tag[]> {
    const tags = await this.tagModel.find({ active: true })

    return this.tagMapper.mapList(tags)
  }
}
