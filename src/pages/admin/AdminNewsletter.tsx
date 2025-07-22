import React, { useState, useEffect } from 'react';
import { Mail, Users, Download, Search, Filter, Send, Edit2, Trash2, Eye, RefreshCw, Plus, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNewsletter } from '@/hooks/useNewsletter';
import { toast } from 'sonner';

const AdminNewsletter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [novoEmailDialog, setNovoEmailDialog] = useState(false);
  const [novoEmail, setNovoEmail] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [emailDeletando, setEmailDeletando] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { newsletters, loading, fetchNewsletters, cadastrarEmail, atualizarNewsletter, removerNewsletter } = useNewsletter();

  const atualizarDados = async () => {
    setIsRefreshing(true);
    await fetchNewsletters();
    setIsRefreshing(false);
  };

  // Exportar dados CSV
  const exportNewslettersCSV = () => {
    try {
      if (newsletters.length === 0) {
        toast.info('Não há dados para exportar');
        return;
      }

      // Criar cabeçalho CSV
      let csvContent = 'Email,Nome,Status,Data de Cadastro\n';

      // Adicionar dados
      newsletters.forEach((newsletter) => {
        const formattedDate = new Date(newsletter.created_at).toLocaleDateString('pt-BR');
        csvContent += `"${newsletter.email}","${newsletter.nome || ''}","${newsletter.status}","${formattedDate}"\n`;
      });

      // Criar Blob e link para download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `newsletter-fespin-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Arquivo CSV gerado com sucesso');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  // Filtrar e ordenar newsletters
  const newslettersFiltrados = React.useMemo(() => {
    let filtrados = [...newsletters];

    // Aplicar filtro de texto
    if (filtroTexto) {
      const termoLowerCase = filtroTexto.toLowerCase();
      filtrados = filtrados.filter(
        n => 
          n.email.toLowerCase().includes(termoLowerCase) || 
          (n.nome && n.nome.toLowerCase().includes(termoLowerCase))
      );
    }

    // Aplicar filtro por status
    if (activeTab !== 'todos') {
      filtrados = filtrados.filter(n => n.status === activeTab);
    }

    return filtrados;
  }, [newsletters, filtroTexto, activeTab]);

  // Paginação
  const totalPaginas = Math.ceil(newslettersFiltrados.length / itensPorPagina);
  const newslettersPaginados = React.useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return newslettersFiltrados.slice(inicio, fim);
  }, [newslettersFiltrados, paginaAtual, itensPorPagina]);

  // Adicionar novo email
  const handleAdicionarEmail = async () => {
    if (!novoEmail || !novoEmail.includes('@')) {
      toast.error('Por favor, informe um email válido');
      return;
    }

    const resultado = await cadastrarEmail(novoEmail, novoNome || undefined);
    if (!resultado.error) {
      setNovoEmail('');
      setNovoNome('');
      setNovoEmailDialog(false);
      await fetchNewsletters(); // Recarregar a lista
    }
  };

  // Cores e status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Inativo</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  if (loading && newsletters.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Carregando newsletters...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Newsletter
          </h1>
          <p className="text-gray-600">
            Gerencie os emails cadastrados na newsletter
          </p>
        </div>

      {/* Menu de navegação */}
      <div className="flex justify-between items-center">
        <div className="space-x-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="todos" className="data-[state=active]:bg-blue-100">
                Todos
              </TabsTrigger>
              <TabsTrigger value="ativo" className="data-[state=active]:bg-green-100">
                Ativos
              </TabsTrigger>
              <TabsTrigger value="inativo" className="data-[state=active]:bg-yellow-100">
                Inativos
              </TabsTrigger>
              <TabsTrigger value="cancelado" className="data-[state=active]:bg-red-100">
                Cancelados
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={exportNewslettersCSV} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </Button>
          
          <Dialog open={novoEmailDialog} onOpenChange={setNovoEmailDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Adicionar Email</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Email à Newsletter</DialogTitle>
                <DialogDescription>
                  Insira os dados para adicionar um novo contato à newsletter.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={novoEmail}
                    onChange={e => setNovoEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome (opcional)</label>
                  <Input 
                    placeholder="Nome do contato" 
                    value={novoNome}
                    onChange={e => setNovoNome(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNovoEmailDialog(false)}>Cancelar</Button>
                <Button onClick={handleAdicionarEmail}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conteúdo principal */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Gerenciamento de Newsletters
              </CardTitle>
              <CardDescription>
                {newslettersFiltrados.length} emails encontrados
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar emails..."
                value={filtroTexto}
                onChange={e => setFiltroTexto(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-500">Carregando dados...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : newslettersPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">Nenhum email encontrado</p>
                    {filtroTexto && (
                      <p className="text-sm text-gray-400 mt-2">Tente ajustar os filtros de busca</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                newslettersPaginados.map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell className="font-medium">{newsletter.email}</TableCell>
                    <TableCell>{newsletter.nome || '-'}</TableCell>
                    <TableCell>{getStatusBadge(newsletter.status)}</TableCell>
                    <TableCell>{new Date(newsletter.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {newsletter.status !== 'ativo' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                            onClick={async () => {
                              await atualizarNewsletter(newsletter.id, { status: 'ativo' });
                              await fetchNewsletters();
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {newsletter.status !== 'inativo' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                            onClick={async () => {
                              await atualizarNewsletter(newsletter.id, { status: 'inativo' });
                              await fetchNewsletters();
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Dialog
                          open={emailDeletando === newsletter.id}
                          onOpenChange={(isOpen) => !isOpen && setEmailDeletando(null)}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                              onClick={() => setEmailDeletando(newsletter.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar exclusão</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja excluir o email <strong>{newsletter.email}</strong>? 
                                Esta ação não pode ser desfeita.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEmailDeletando(null)}>Cancelar</Button>
                              <Button 
                                variant="destructive" 
                                onClick={async () => {
                                  if (emailDeletando) {
                                    await removerNewsletter(emailDeletando);
                                    await fetchNewsletters();
                                    setEmailDeletando(null);
                                  }
                                }}
                              >
                                Excluir
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="flex items-center gap-2">
            <Select
              value={String(itensPorPagina)}
              onValueChange={(value) => {
                setItensPorPagina(Number(value));
                setPaginaAtual(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itensPorPagina} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">itens por página</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Página {paginaAtual} de {totalPaginas || 1}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual >= totalPaginas}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
    </div>
  );
};

export default AdminNewsletter;