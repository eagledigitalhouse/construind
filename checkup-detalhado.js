import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkupDetalhado() {
  console.log('🔍 CHECKUP DETALHADO DO BANCO DE DADOS\n');
  console.log('=' .repeat(60));
  
  try {
    // 1. Status das tabelas principais
    console.log('\n📊 STATUS DAS TABELAS PRINCIPAIS:');
    console.log('-'.repeat(40));
    
    // Verificar entities
    console.log('\n🔍 TABELA: entities');
    const { data: entitiesData, error: entitiesError } = await supabase
      .from('entities')
      .select('*')
      .limit(1);
    
    if (entitiesError) {
      console.log('❌ STATUS: NÃO EXISTE');
      console.log(`   Erro: ${entitiesError.message}`);
    } else {
      console.log('✅ STATUS: EXISTE');
      const { count } = await supabase
        .from('entities')
        .select('*', { count: 'exact', head: true });
      console.log(`   📊 Registros: ${count || 0}`);
    }
    
    // Verificar entidades
    console.log('\n🔍 TABELA: entidades');
    const { data: entidadesData, error: entidadesError } = await supabase
      .from('entidades')
      .select('*')
      .limit(1);
    
    if (entidadesError) {
      console.log('❌ STATUS: NÃO EXISTE');
      console.log(`   Erro: ${entidadesError.message}`);
    } else {
      console.log('✅ STATUS: EXISTE');
      const { count } = await supabase
        .from('entidades')
        .select('*', { count: 'exact', head: true });
      console.log(`   📊 Registros: ${count || 0}`);
      
      if (entidadesData && entidadesData.length > 0) {
        console.log('   🏗️  ESTRUTURA:');
        const campos = Object.keys(entidadesData[0]);
        campos.forEach(campo => {
          console.log(`      - ${campo}`);
        });
      }
    }
    
    // Verificar pre_inscricao_expositores
    console.log('\n🔍 TABELA: pre_inscricao_expositores');
    const { data: preInscricaoData, error: preInscricaoError } = await supabase
      .from('pre_inscricao_expositores')
      .select('*')
      .limit(1);
    
    if (preInscricaoError) {
      console.log('❌ STATUS: NÃO EXISTE');
      console.log(`   Erro: ${preInscricaoError.message}`);
    } else {
      console.log('✅ STATUS: EXISTE');
      const { count } = await supabase
        .from('pre_inscricao_expositores')
        .select('*', { count: 'exact', head: true });
      console.log(`   📊 Registros: ${count || 0}`);
    }
    
    // 2. Análise dos dados da tabela entidades
    if (!entidadesError && entidadesData) {
      console.log('\n' + '='.repeat(60));
      console.log('📋 ANÁLISE DETALHADA DA TABELA ENTIDADES:');
      console.log('-'.repeat(40));
      
      // Buscar todos os registros para análise
      const { data: todasEntidades } = await supabase
        .from('entidades')
        .select('*');
      
      if (todasEntidades && todasEntidades.length > 0) {
        console.log(`\n📊 Total de entidades: ${todasEntidades.length}`);
        
        // Análise por tipo
        const tiposCount = {};
        const categoriasCount = {};
        const statusCount = {};
        
        todasEntidades.forEach(entidade => {
          // Contar tipos
          const tipo = entidade.tipo || 'não_definido';
          tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
          
          // Contar categorias
          const categoria = entidade.categoria || 'não_definida';
          categoriasCount[categoria] = (categoriasCount[categoria] || 0) + 1;
          
          // Contar status
          const status = entidade.status || 'não_definido';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        
        console.log('\n🏷️  DISTRIBUIÇÃO POR TIPO:');
        Object.entries(tiposCount).forEach(([tipo, count]) => {
          console.log(`   ${tipo}: ${count}`);
        });
        
        console.log('\n📂 DISTRIBUIÇÃO POR CATEGORIA:');
        Object.entries(categoriasCount).forEach(([categoria, count]) => {
          console.log(`   ${categoria}: ${count}`);
        });
        
        console.log('\n📊 DISTRIBUIÇÃO POR STATUS:');
        Object.entries(statusCount).forEach(([status, count]) => {
          console.log(`   ${status}: ${count}`);
        });
        
        // Mostrar exemplo de registro
        console.log('\n📄 EXEMPLO DE REGISTRO:');
        console.log('-'.repeat(30));
        const exemplo = todasEntidades[0];
        Object.entries(exemplo).forEach(([campo, valor]) => {
          if (typeof valor === 'object' && valor !== null) {
            console.log(`${campo}: ${JSON.stringify(valor, null, 2)}`);
          } else {
            console.log(`${campo}: ${valor}`);
          }
        });
      }
    }
    
    // 3. Verificar outras tabelas do sistema
    console.log('\n' + '='.repeat(60));
    console.log('🗂️  OUTRAS TABELAS DO SISTEMA:');
    console.log('-'.repeat(40));
    
    const outrasTabelas = [
      'contratos_gerados',
      'modelos_contratos', 
      'stands_fespin',
      'categorias',
      'newsletters',
      'entidades_historico',
      'entidades_documentos',
      'entidades_lembretes'
    ];
    
    for (const tabela of outrasTabelas) {
      try {
        const { data, error } = await supabase
          .from(tabela)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${tabela}: ${error.message}`);
        } else {
          const { count } = await supabase
            .from(tabela)
            .select('*', { count: 'exact', head: true });
          
          console.log(`✅ ${tabela}: ${count || 0} registros`);
        }
      } catch (err) {
        console.log(`❌ ${tabela}: Erro inesperado`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 CONCLUSÕES:');
    console.log('-'.repeat(40));
    
    if (entitiesError) {
      console.log('❌ A tabela ENTITIES (do template) NÃO EXISTE no banco atual');
    } else {
      console.log('✅ A tabela ENTITIES (do template) EXISTE no banco atual');
    }
    
    if (entidadesError) {
      console.log('❌ A tabela ENTIDADES (customizada) NÃO EXISTE no banco atual');
    } else {
      console.log('✅ A tabela ENTIDADES (customizada) EXISTE no banco atual');
    }
    
    console.log('\n🎉 CHECKUP DETALHADO CONCLUÍDO!');
    
  } catch (error) {
    console.error('💥 Erro durante o checkup:', error.message);
  }
}

// Executar o checkup
checkupDetalhado();