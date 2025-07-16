import { supabase } from './supabase'

export async function uploadImage(file: File, bucket: string, pathPrefix = ''): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = pathPrefix ? `${pathPrefix}/${fileName}` : fileName

    console.log(`Tentando upload para bucket: ${bucket}, arquivo: ${fileName}`)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true })

    if (error) {
      console.error('Erro detalhado do upload:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error
      })
      
      // Mensagens de erro mais específicas
      if (error.message?.includes('Bucket not found')) {
        console.error(`Bucket '${bucket}' não encontrado. Verifique se foi criado no Supabase.`)
      } else if (error.message?.includes('not allowed')) {
        console.error('Upload não permitido. Verifique as políticas de RLS do bucket.')
      } else if (error.statusCode === 400) {
        console.error('Erro 400: Requisição inválida. Verifique se o bucket existe e as políticas estão configuradas.')
      }
      
      return null
    }

    console.log('Upload realizado com sucesso:', data)

    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
    console.log('URL pública gerada:', publicUrlData?.publicUrl)
    
    return publicUrlData?.publicUrl ?? null
  } catch (error) {
    console.error('Erro inesperado no upload:', error)
    return null
  }
}