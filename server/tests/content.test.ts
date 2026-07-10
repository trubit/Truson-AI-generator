import { ContentModel } from '../src/modules/content/models/content.model';
import { CollectionModel } from '../src/modules/content/models/collection.model';
import { VersionModel } from '../src/modules/content/models/version.model';
import { contentService } from '../src/modules/content/services/content.service';
import { collectionService } from '../src/modules/content/services/collection.service';
import { connectDatabase } from '../src/database/connection';
import mongoose from 'mongoose';

jest.setTimeout(30000);

describe('Content and Collections CMS Database Suite', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  let collectionId = '';
  let documentId = '';

  beforeAll(async () => {
    await connectDatabase();
    await ContentModel.deleteMany({});
    await CollectionModel.deleteMany({});
    await VersionModel.deleteMany({});
  });

  afterAll(async () => {
    await ContentModel.deleteMany({});
    await CollectionModel.deleteMany({});
    await VersionModel.deleteMany({});
    await mongoose.connection.close();
  });

  // 1. Collections Tests
  it('should create a collection successfully', async () => {
    const col = await collectionService.createCollection(mockUserId, {
      name: 'Blog Campaigns',
      description: 'Contains marketing blogs',
      visibility: 'private',
    });

    expect(col._id).toBeDefined();
    expect(col.name).toBe('Blog Campaigns');
    collectionId = col._id.toString();
  });

  it('should prevent creating duplicate collection names for the same user', async () => {
    await expect(
      collectionService.createCollection(mockUserId, {
        name: 'Blog Campaigns',
      })
    ).rejects.toThrow('Collection with this name already exists');
  });

  // 2. Content Tests
  it('should create content document under a collection', async () => {
    const doc = await contentService.createContent(mockUserId, {
      title: 'Intro to Node.js',
      category: 'Education',
      contentType: 'Tutorial',
      editorMode: 'markdown',
      generatedContent: 'Node.js is a JavaScript runtime built on Chrome V8 engine.',
      collectionId,
    });

    expect(doc._id).toBeDefined();
    expect(doc.wordCount).toBeGreaterThan(0);
    expect(doc.collectionId?.toString()).toBe(collectionId);
    documentId = doc._id.toString();
  });

  it('should list content filters by status and collection', async () => {
    const result = await contentService.listContent(mockUserId, {
      collectionId,
      category: 'Education',
    });

    expect(result.total).toBe(1);
    expect(result.items[0].title).toBe('Intro to Node.js');
  });

  // 3. Versioning Tests
  it('should generate version history on content body updates', async () => {
    // Perform update
    const updated = await contentService.updateContent(mockUserId, documentId, {
      generatedContent: 'Node.js is built on Chrome V8. It supports non-blocking I/O.',
    });

    expect(updated.wordCount).toBeGreaterThan(0);

    // Verify version record exists
    const versions = await contentService.getVersions(mockUserId, documentId);
    expect(versions.length).toBe(1);
    expect(versions[0].previousContent).toBe('Node.js is a JavaScript runtime built on Chrome V8 engine.');
  });

  it('should restore to a previous version from history', async () => {
    const restored = await contentService.restoreVersion(mockUserId, documentId, 1);
    expect(restored.generatedContent).toBe('Node.js is a JavaScript runtime built on Chrome V8 engine.');
  });
});
