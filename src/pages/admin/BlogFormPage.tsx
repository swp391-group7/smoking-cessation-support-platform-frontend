import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlog, updateBlog, fetchBlogById } from '@/api/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';

interface BlogFormValues {
  title: string;
  content: string;
  images: string;
  blogType: string;
}

export default function BlogFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<BlogFormValues>();

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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Blog' : 'Create Blog'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register('title', { required: true })} placeholder="Title" />
        <Textarea {...register('content', { required: true })} placeholder="Content" rows={6} />
        <Input {...register('images')} placeholder="Image URL" />
        <Input {...register('blogType', { required: true })} placeholder="Blog Type (e.g. tips)" />
        <Button type="submit" className="w-full">{isEdit ? 'Update' : 'Create'}</Button>
      </form>
    </div>
  );
}