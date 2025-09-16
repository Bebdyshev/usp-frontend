'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import api, { User, CreateUserRequest, UpdateUserRequest } from '@/lib/api';
import { ApiError } from '@/utils/errorHandler';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types are now imported from api.ts

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest & UpdateUserRequest>({
    name: '',
    email: '',
    password: '',
    type: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await api.getUsers();
      setUsers(users);
      setError(null);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      toast.error(`Ошибка загрузки пользователей: ${apiError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      type: 'user'
    });
    setCurrentUser(null);
    setShowPassword(false);
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.type) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await api.createUser(formData as CreateUserRequest);
      toast.success('Пользователь успешно создан');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(`Ошибка создания пользователя: ${apiError.message}`);
    }
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      type: user.type || 'user'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!currentUser) return;
    
    // Создаем объект только с заполненными полями
    const updateData: UpdateUserRequest = {};
    if (formData.name) updateData.name = formData.name;
    if (formData.email) updateData.email = formData.email;
    if (formData.password) updateData.password = formData.password;
    if (formData.type) updateData.type = formData.type;
    
    // Проверяем, есть ли что обновлять
    if (Object.keys(updateData).length === 0) {
      toast.error('Необходимо изменить хотя бы одно поле');
      return;
    }
    
    try {
      await api.updateUser(currentUser.id, updateData);
      toast.success('Пользователь успешно обновлен');
      setIsEditDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(`Ошибка обновления пользователя: ${apiError.message}`);
    }
  };

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      await api.deleteUser(currentUser.id);
      toast.success('Пользователь успешно удален');
      setIsDeleteDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(`Ошибка удаления пользователя: ${apiError.message}`);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'admin': return 'Администратор';
      case 'teacher': return 'Учитель';
      case 'user': return 'Пользователь';
      default: return type;
    }
  };

  return (
    <PageContainer scrollable>
      <div className="py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление пользователями</h1>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus size={16} /> Добавить пользователя
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardContent className="p-4 text-red-600">
              {error}
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              Загрузка пользователей...
            </CardContent>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Пользователи не найдены. Нажмите "Добавить пользователя", чтобы создать нового.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Пользователи</CardTitle>
              <CardDescription>Управление пользователями системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 border-b border-gray-200 font-semibold">ID</th>
                      <th className="p-3 border-b border-gray-200 font-semibold">Имя</th>
                      <th className="p-3 border-b border-gray-200 font-semibold">Email</th>
                      <th className="p-3 border-b border-gray-200 font-semibold">Тип</th>
                      <th className="p-3 border-b border-gray-200 font-semibold text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b border-gray-200">{user.id}</td>
                        <td className="p-3 border-b border-gray-200 font-medium">{user.name}</td>
                        <td className="p-3 border-b border-gray-200">{user.email}</td>
                        <td className="p-3 border-b border-gray-200">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.type === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.type === 'teacher'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getUserTypeLabel(user.type)}
                          </span>
                        </td>
                        <td className="p-3 border-b border-gray-200 text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(user)}
                            className="h-8 w-8 inline-flex items-center justify-center"
                            title="Редактировать"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteClick(user)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 inline-flex items-center justify-center"
                            title="Удалить"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить нового пользователя</DialogTitle>
              <DialogDescription>
                Введите информацию о новом пользователе
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Введите имя пользователя"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Введите email пользователя"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите пароль"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Тип пользователя</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Выберите тип пользователя" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="teacher">Учитель</SelectItem>
                    <SelectItem value="user">Пользователь</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleCreateUser}>Создать</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать пользователя</DialogTitle>
              <DialogDescription>
                Обновите информацию о пользователе
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Имя</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-password">Новый пароль (оставьте пустым, чтобы не менять)</Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Введите новый пароль"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-type">Тип пользователя</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="edit-type" className="w-full">
                    <SelectValue placeholder="Выберите тип пользователя" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="teacher">Учитель</SelectItem>
                    <SelectItem value="user">Пользователь</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleUpdateUser}>Обновить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить пользователя</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить пользователя {currentUser?.name}? Это действие нельзя отменить.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
