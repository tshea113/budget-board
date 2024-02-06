import ResponsiveButton from '@/components/responsive-button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import request from '@/lib/request';
import { getUser } from '@/lib/user';
import { Type, SubType, type NewAccount } from '@/types/account';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(1).max(50),
  institution: z.string().min(1).max(50),
  type: z.string().min(1).max(50),
  subtype: z.string().min(1).max(50),
});

const AddAccount = (): JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      institution: '',
      type: 'None',
      subtype: 'None',
    },
  });

  const { isPending, isError, data } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUser();
      return response;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newAccount: NewAccount) => {
      return await request({
        url: '/api/account',
        method: 'POST',
        data: newAccount,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const watchType: string = useWatch({
    control: form.control,
    name: 'type',
  });

  const getSubTypes = (type: string): string[] => {
    return SubType[Type.indexOf(type)] ?? [];
  };

  interface FormValues {
    name: string;
    institution: string;
    type: string;
    subtype: string;
  }

  const submitAccount: SubmitHandler<FormValues> = (values: z.infer<typeof formSchema>): any => {
    if (Boolean(isPending) || Boolean(isError)) {
      console.error('There was an issue getting info from the server.');
      return;
    }

    const newAccount: NewAccount = {
      name: values.name,
      institution: values.institution,
      type: values.type,
      subtype: values.subtype,
      source: 'manual',
      userId: data?.data.id,
    };
    mutation.mutate(newAccount);
  };

  return (
    <Card className="mb-2 w-full p-2">
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(submitAccount)(event);
          }}
          className="space-y-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex w-screen flex-col">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="min-w-min" placeholder="Enter a name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem className="flex w-screen flex-col">
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input className="min-w-min" placeholder="Enter an Institution" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex w-screen flex-col">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        form.resetField('subtype', { keepDirty: false });
                      }}
                    >
                      <SelectTrigger className="min-w-min">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Type.map((value: string, index: number) => (
                          <SelectItem key={index} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {getSubTypes(watchType).length !== 0 && (
              <FormField
                control={form.control}
                name="subtype"
                render={({ field }) => (
                  <FormItem className="flex w-screen flex-col">
                    <FormLabel>Subtype</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue="None">
                        <SelectTrigger className="min-w-min">
                          <SelectValue asChild>
                            <p>{field.value}</p>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {getSubTypes(watchType).map((value: string, index: number) => (
                            <SelectItem key={index} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
          <ResponsiveButton loading={mutation.isPending} onClick={() => {}}>
            Submit
          </ResponsiveButton>
        </form>
      </Form>
    </Card>
  );
};

export default AddAccount;
