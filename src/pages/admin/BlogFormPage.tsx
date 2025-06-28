import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlog, updateBlog, fetchBlogById, BlogType } from '@/api/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogFormValues {
  title: string;
  content: string;
  images: string;
  blogType: BlogType;
}

export default function BlogFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, watch } = useForm<BlogFormValues>();
  
  const watchedBlogType = watch('blogType');

  useEffect(() => {
    if (isEdit && id) {
      fetchBlogById(id).then((data) => {
        reset({
          title: data.title,
          content: data.content,
          images: data.imageUrl,
          blogType: data.blog_type,
        });
      });
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (values: BlogFormValues) => {
    try {
      if (isEdit && id) {
        await updateBlog(id, values);
      } else {
        await createBlog(values);
      }
      navigate('/admin/blog');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Failed to save blog');
    }
  };

  const getBlogTypeLabel = (type: BlogType) => {
    switch (type) {
      case BlogType.HEALTH:
        return 'Health';
      case BlogType.SMOKEQUIT:
        return 'Smoke Quit';
      case BlogType.SMOKEHARM:
        return 'Smoke Harm';
      default:
        return type;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Blog' : 'Create Blog'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input {...register('title', { required: true })} placeholder="Enter blog title" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <Textarea 
            {...register('content', { required: true })} 
            placeholder="Enter blog content" 
            rows={8} 
            className="min-h-[200px]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <Input {...register('images')} placeholder="Enter image URL" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Blog Type</label>
          <Select 
            value={watchedBlogType} 
            onValueChange={(value: BlogType) => setValue('blogType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blog type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BlogType.HEALTH}>
                {getBlogTypeLabel(BlogType.HEALTH)}
              </SelectItem>
              <SelectItem value={BlogType.SMOKEQUIT}>
                {getBlogTypeLabel(BlogType.SMOKEQUIT)}
              </SelectItem>
              <SelectItem value={BlogType.SMOKEHARM}>
                {getBlogTypeLabel(BlogType.SMOKEHARM)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {isEdit ? 'Update Blog' : 'Create Blog'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/blog')}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}