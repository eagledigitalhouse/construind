import { showToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TesteToast = () => {
  const testarToastSucesso = () => {
    showToast.success('Ação confirmada com sucesso!');
  };

  const testarToastErro = () => {
    showToast.error('Erro ao processar a solicitação');
  };

  const testarToastInfo = () => {
    showToast.info('Informação importante para o usuário');
  };

  const testarToastAviso = () => {
    showToast.warning('Atenção: verifique os dados inseridos');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Teste do Sistema de Toast</CardTitle>
            <CardDescription>
              Teste as diferentes variações de toast com animações e posicionamento no canto inferior direito
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={testarToastSucesso}
                className="bg-green-600 hover:bg-green-700"
              >
                Toast de Sucesso
              </Button>
              
              <Button 
                onClick={testarToastErro}
                variant="destructive"
              >
                Toast de Erro
              </Button>
              
              <Button 
                onClick={testarToastInfo}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Toast de Informação
              </Button>
              
              <Button 
                onClick={testarToastAviso}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Toast de Aviso
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Características implementadas:</h3>
              <ul className="text-sm space-y-1">
                <li>• Posicionamento no canto inferior direito</li>
                <li>• Animação de check para toast de sucesso</li>
                <li>• Duração de 4 segundos</li>
                <li>• Estilo visual aprimorado com cores e bordas</li>
                <li>• Ícones temáticos para cada tipo</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TesteToast;