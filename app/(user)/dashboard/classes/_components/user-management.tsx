'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, User as UserIcon, Users as UsersIcon, GraduationCap, BookOpen, Search, Pencil } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { User as AppUser, Subject } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateUserData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  type: string;
  shanyrak?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string>('admin');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [teacherAssignments, setTeacherAssignments] = useState<Record<number, { subjects: string[]; classes: string[] }>>({});
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; first_name?: string; last_name?: string; email: string; password?: string; type: string; shanyrak?: string }>({ name: '', email: '', type: 'user' });
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    type: 'curator',
    shanyrak: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [selectedUserType]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (selectedUserType === 'all') {
        const allUsers = await api.getUsers();
        setUsers(allUsers as unknown as AppUser[]);
      } else {
        const typeUsers = await api.getUsersByType(selectedUserType);
        setUsers(typeUsers as unknown as AppUser[]);
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast.error('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const first = (u.first_name || '').toLowerCase();
      const last = (u.last_name || '').toLowerCase();
      return (
        name.includes(q) || email.includes(q) || first.includes(q) || last.includes(q)
      );
    });
  }, [users, searchQuery]);

  useEffect(() => {
    if (selectedUserType === 'teacher' && users.length) {
      hydrateTeacherAssignments();
    }
  }, [selectedUserType, users]);

  const hydrateTeacherAssignments = async () => {
    try {
      const assignments = await api.getTeacherAssignments();
      const map: Record<number, { subjects: Set<string>; classes: Set<string> }> = {} as any;
      for (const a of assignments as any[]) {
        if (!a.teacher_id) continue;
        if (!map[a.teacher_id]) map[a.teacher_id] = { subjects: new Set(), classes: new Set() };
        if (a.subject_name) map[a.teacher_id].subjects.add(a.subject_name);
        const cls = a.subgroup_name ? `${a.grade_name || ''} (${a.subgroup_name})`.trim() : (a.grade_name || '');
        if (cls) map[a.teacher_id].classes.add(cls);
      }
      const compact: Record<number, { subjects: string[]; classes: string[] }> = {};
      Object.entries(map).forEach(([tid, v]) => {
        compact[Number(tid)] = { subjects: Array.from(v.subjects), classes: Array.from(v.classes) };
      });
      setTeacherAssignments(compact);
    } catch (e) {
      // Non-fatal
    }
  };

  const openEditDialog = async (user: AppUser) => {
    setCurrentUser(user);
    setEditForm({
      name: (user.name || `${user.first_name || ''} ${user.last_name || ''}`).trim(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email || '',
      password: '',
      type: user.type || 'user',
      shanyrak: user.shanyrak
    });

    try {
      if (user.type === 'teacher') {
        // Load subjects and current teacher assignments
        const [subjects, assignments] = await Promise.all([
          api.getAllSubjects(),
          api.getTeacherAssignments({ teacher_id: user.id })
        ]);
        setAllSubjects(subjects as Subject[]);
        const activeSubjectIds = (assignments as any[])
          .filter(a => a.is_active === 1)
          .map(a => a.subject_id as number);
        setSelectedSubjectIds(Array.from(new Set(activeSubjectIds)));
      } else {
        setAllSubjects([]);
        setSelectedSubjectIds([]);
      }
    } catch (e: any) {
      // Non-fatal; allow editing basic info even if subjects fail to load
      setAllSubjects([]);
      setSelectedSubjectIds([]);
    }

    setIsEditDialogOpen(true);
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate full name from first_name and last_name
      if (field === 'first_name' || field === 'last_name') {
        updated.name = `${updated.first_name} ${updated.last_name}`.trim();
      }
      
      return updated;
    });
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error('Заполните все обязательные поля');
        return;
      }

      await api.createUser({
        name: formData.name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        type: formData.type,
        shanyrak: formData.shanyrak
      } as any);

      toast.success(`${formData.type === 'curator' ? 'Куратор' : 'Учитель'} успешно создан`);
      setIsCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast.error(error.message || 'Ошибка при создании пользователя');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      type: 'curator',
      shanyrak: ''
    });
  };

  const getUserTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      admin: 'Администратор',
      curator: 'Куратор',
      teacher: 'Учитель',
      user: 'Пользователь'
    };
    return labels[type] || type;
  };

  const getUserTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      curator: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Управление пользователями</h2>
          <p className="text-muted-foreground">
            Создание и управление кураторами и учителями
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Создать пользователя</DialogTitle>
              <DialogDescription>
                Добавить нового куратора или учителя в систему
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Имя *</Label>
                  <Input
                    id="first_name"
                    placeholder="Керей"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Фамилия *</Label>
                  <Input
                    id="last_name"
                    placeholder="Бердышев"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="berdyshev_k@akb.nis.edu.kz"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Тип пользователя *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curator">Куратор</SelectItem>
                    <SelectItem value="teacher">Учитель</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'curator' && (
                <div className="space-y-2">
                  <Label htmlFor="shanyrak">Шанырак</Label>
                  <Input
                    id="shanyrak"
                    placeholder="Көшбасшы"
                    value={formData.shanyrak}
                    onChange={(e) => handleInputChange('shanyrak', e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleCreateUser}>
                  Создать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs + Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <Tabs value={selectedUserType} onValueChange={setSelectedUserType}>
              <TabsList>
                <TabsTrigger value="admin">Админы</TabsTrigger>
                <TabsTrigger value="curator">Кураторы</TabsTrigger>
                <TabsTrigger value="teacher">Учителя</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1">
              <Label htmlFor="user-search" className="mb-2 inline-block">Поиск</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="user-search"
                  placeholder="Поиск по имени или email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            {selectedUserType === 'admin' ? 'Администраторы' : selectedUserType === 'curator' ? 'Кураторы' : 'Учителя'} ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Пользователи не найдены</h3>
              <p className="text-muted-foreground">
                Создайте первого куратора или учителя
              </p>
            </div>
          ) : (
            <div className="overflow-x-hidden">
              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  <col style={{ width: '64px' }} />
                  <col />
                  <col style={{ width: '24%' }} />
                  {selectedUserType === 'teacher' && <col style={{ width: '18%' }} />}
                  {selectedUserType === 'teacher' && <col style={{ width: '18%' }} />}
                  <col style={{ width: '120px' }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border-b border-gray-200 font-semibold">ID</th>
                    <th className="p-3 border-b border-gray-200 font-semibold">ФИО</th>
                    <th className="p-3 border-b border-gray-200 font-semibold">Email</th>
                    {selectedUserType === 'curator' && (
                      <>
                        <th className="p-3 border-b border-gray-200 font-semibold">Шанырак</th>
                        <th className="p-3 border-b border-gray-200 font-semibold">Классов</th>
                      </>
                    )}
                    {selectedUserType === 'teacher' && (
                      <>
                        <th className="p-3 border-b border-gray-200 font-semibold">Предметы</th>
                        <th className="p-3 border-b border-gray-200 font-semibold">Классы</th>
                      </>
                    )}
                    <th className="p-3 border-b border-gray-200 font-semibold text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b border-gray-200">{user.id}</td>
                      <td className="p-3 border-b border-gray-200 font-medium">{user.name}</td>
                      <td className="p-3 border-b border-gray-200">{user.email}</td>
                      {selectedUserType === 'curator' && (
                        <>
                          <td className="p-3 border-b border-gray-200">{user.shanyrak || '-'}</td>
                          <td className="p-3 border-b border-gray-200">{user.assigned_grades_count ?? 0}</td>
                        </>
                      )}
                      {selectedUserType === 'teacher' && (
                        <>
                          <td className="p-3 border-b border-gray-200 align-middle">
                            <div className="text-sm whitespace-normal break-words leading-5 max-h-20 overflow-hidden">
                              {(teacherAssignments[user.id]?.subjects || []).join(', ') || '-'}
                            </div>
                          </td>
                          <td className="p-3 border-b border-gray-200 align-middle">
                            <div className="text-sm whitespace-normal break-words leading-5 max-h-20 overflow-hidden">
                              {(teacherAssignments[user.id]?.classes || []).join(', ') || '-'}
                            </div>
                          </td>
                        </>
                      )}
                      <td className="p-3 border-b border-gray-200 text-right">
                        <Button
                          variant="outline"
                          onClick={() => openEditDialog(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
            <DialogDescription>
              Обновите информацию пользователя
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fio">ФИО</Label>
              <Input
                id="edit-fio"
                placeholder="Фамилия Имя Отчество"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@domain.kz"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Новый пароль (опционально)</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Оставьте пустым, чтобы не менять"
                value={editForm.password || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Тип пользователя</Label>
              <Select value={editForm.type} onValueChange={(val) => setEditForm(prev => ({ ...prev, type: val }))}>
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="curator">Куратор</SelectItem>
                  <SelectItem value="teacher">Учитель</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editForm.type === 'curator' && (
              <div className="space-y-2">
                <Label htmlFor="edit-shanyrak">Шанырак</Label>
                <Input
                  id="edit-shanyrak"
                  placeholder="Көшбасшы"
                  value={editForm.shanyrak || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, shanyrak: e.target.value }))}
                />
              </div>
            )}

            {editForm.type === 'teacher' && (
              <div className="space-y-2">
                <Label>Предметы учителя</Label>
                <div className="rounded-md border border-gray-200">
                  <ScrollArea className="h-48 p-2">
                    {allSubjects.length === 0 ? (
                      <div className="text-sm text-muted-foreground px-1 py-2">Нет предметов</div>
                    ) : (
                      <div className="space-y-2">
                        {allSubjects.map((s) => {
                          const checked = selectedSubjectIds.includes(s.id);
                          return (
                            <label key={s.id} className="flex items-center gap-2 px-1">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(val) => {
                                  setSelectedSubjectIds((prev) => {
                                    const isChecked = Boolean(val);
                                    if (isChecked) return Array.from(new Set([...prev, s.id]));
                                    return prev.filter((id) => id !== s.id);
                                  });
                                }}
                              />
                              <span className="text-sm">{s.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                <p className="text-xs text-muted-foreground">Выберите предметы, которые ведёт учитель. Привязка к классам/подгруппам настраивается отдельно.</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
              <Button
                onClick={async () => {
                  if (!currentUser) return;
                  const payload: any = {};
                  if (editForm.name) {
                    payload.name = editForm.name.trim();
                    const parts = editForm.name.trim().split(/\s+/);
                    payload.first_name = parts.length > 1 ? parts[1] : parts[0] || undefined;
                    payload.last_name = parts.length > 1 ? parts[0] : undefined;
                  }
                  if (editForm.email) payload.email = editForm.email;
                  if (editForm.password) payload.password = editForm.password;
                  if (editForm.type) payload.type = editForm.type;
                  if (editForm.type === 'curator') payload.shanyrak = editForm.shanyrak || null;

                  try {
                    await api.updateUser(currentUser.id, payload as any);

                    // Sync teacher subjects (assignments without grade/subgroup)
                    if (editForm.type === 'teacher') {
                      try {
                        const currentAssignments = await api.getTeacherAssignments({ teacher_id: currentUser.id });
                        const activeIds = new Set((currentAssignments as any[]).filter(a => a.is_active === 1).map(a => a.subject_id as number));
                        const selectedIds = new Set(selectedSubjectIds);

                        // Add new assignments
                        const toAdd: number[] = Array.from(selectedIds).filter(id => !activeIds.has(id));
                        for (const subjectId of toAdd) {
                          await api.createTeacherAssignment({ teacher_id: currentUser.id, subject_id: subjectId });
                        }

                        // Remove unchecked assignments (soft delete)
                        const toRemoveSubjects: number[] = Array.from(activeIds).filter(id => !selectedIds.has(id));
                        if (toRemoveSubjects.length > 0) {
                          for (const a of currentAssignments as any[]) {
                            if (a.is_active === 1 && toRemoveSubjects.includes(a.subject_id)) {
                              await api.deleteTeacherAssignment(a.id);
                            }
                          }
                        }
                      } catch (e) {
                        // Non-fatal; user info still updated
                      }
                    }

                    toast.success('Пользователь обновлён');
                    setIsEditDialogOpen(false);
                    setCurrentUser(null);
                    await fetchUsers();
                    if (selectedUserType === 'teacher') await hydrateTeacherAssignments();
                  } catch (e: any) {
                    toast.error(e?.message || 'Ошибка при обновлении');
                  }
                }}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
