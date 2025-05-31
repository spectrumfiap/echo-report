"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from './../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ReportForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [reporterName, setReporterName] = useState('');
  const [eventType, setEventType] = useState('Alagamento');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setReporterName(user.name);
    } else {
      setReporterName('');
    }
  }, [isAuthenticated, user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus(null);

    if (!location || !description) {
      setSubmitStatus({ type: 'error', message: "Localização e Descrição são campos obrigatórios." });
      return;
    }
    // REMOVIDA A VALIDAÇÃO QUE OBRIGAVA O NOME PARA NÃO LOGADOS
    // if (!isAuthenticated && !reporterName.trim()) {
    //   setSubmitStatus({ type: 'error', message: "Por favor, informe seu nome para o reporte ou faça login." });
    //   return;
    // }

    setIsSubmitting(true);

    const formDataForSubmission = new FormData();
    formDataForSubmission.append('reporterName', reporterName.trim() || "Anônimo"); // Usa .trim() e depois fallback para "Anônimo"
    formDataForSubmission.append('eventType', eventType);
    formDataForSubmission.append('description', description);
    formDataForSubmission.append('location', location);
    if (selectedFile) {
      formDataForSubmission.append('image', selectedFile, selectedFile.name);
    }
    if (isAuthenticated && user && user.id) {
      if (user.id !== 'admin_id_special') {
        formDataForSubmission.append('userId', String(user.id));
      }
    }

    try {
      const apiKey = '1234';
      const response = await fetch('http://localhost:8080/reportes', {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
        body: formDataForSubmission,
      });

      if (!response.ok) {
        let backendErrorMessage = `Erro HTTP: ${response.status} (${response.statusText || 'Bad Request'})`;
        try {
            const errorContentType = response.headers.get("content-type");
            if (errorContentType && errorContentType.includes("application/json")) {
                const errorData = await response.json();
                if (errorData) {
                    backendErrorMessage = errorData.message || errorData.title || errorData.detail || 
                                         (errorData.violations && errorData.violations[0]?.message) || 
                                         (typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
                }
            } else {
                const errorText = await response.text();
                if (errorText) {
                    backendErrorMessage = errorText; 
                }
            }
        } catch (e) {
            // Não conseguiu ler o corpo do erro
        }
        throw new Error(backendErrorMessage);
      }

      const result = await response.json();
      alert(`Reporte enviado com sucesso! Você será redirecionado para a página inicial.`);
      router.push('/');

    } catch (error: any) {
      console.error('Falha ao enviar reporte:', error);
      setSubmitStatus({ type: 'error', message: error.message || 'Falha ao conectar com o servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[var(--brand-card-background)] p-6 md:p-8 rounded-lg shadow-[var(--shadow-subtle)] max-w-2xl mx-auto"
    >
      {submitStatus && submitStatus.type === 'error' && (
        <div
          className={`p-4 mb-4 text-sm rounded-lg bg-red-100 text-red-700`}
          role="alert"
        >
          {submitStatus.message}
        </div>
      )}

      <div>
        <label htmlFor="reporterName" className="block text-sm font-medium text-[var(--brand-text-primary)] mb-1">
          Seu Nome {isAuthenticated ? '(Automático)' : '(Opcional)'}
        </label>
        <input
          type="text"
          name="reporterName"
          id="reporterName"
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm transition-colors disabled:bg-slate-100 disabled:text-slate-500"
          placeholder={isAuthenticated ? "Nome preenchido automaticamente" : "Seu nome (ou deixe em branco para anônimo)"}
          disabled={isAuthenticated}
        />
        {!isAuthenticated && <p className="mt-1 text-xs text-[var(--brand-text-secondary)]">Faça login para preencher seu nome automaticamente ou reporte anonimamente.</p>}
      </div>

      <div>
        <label htmlFor="eventType" className="block text-sm font-medium text-[var(--brand-text-primary)] mb-1">
          Tipo de Evento
        </label>
        <select
          id="eventType"
          name="eventType"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm transition-colors"
        >
          <option value="Alagamento">Alagamento</option>
          <option value="QuedaDeArvore">Queda de Árvore</option>
          <option value="FaltaDeEnergia">Falta de Energia</option>
          <option value="AglomeracaoAbrigo">Aglomeração em Abrigo</option>
          <option value="VazamentoGas">Vazamento de Gás</option>
          <option value="Deslizamento">Deslizamento de Terra</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-[var(--brand-text-primary)] mb-1">
          Localização (Endereço ou Ponto de Referência) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm transition-colors"
          placeholder="Ex: Rua das Palmeiras, próximo ao nº 100"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[var(--brand-text-primary)] mb-1">
          Descrição Detalhada <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm transition-colors"
          placeholder="Descreva o que você viu, o nível de severidade, pessoas em risco, etc."
          required
        />
      </div>

      <div>
        <label htmlFor="imageUpload" className="block text-sm font-medium text-[var(--brand-text-primary)] mb-1">
          Foto da Ocorrência (Opcional)
        </label>
        <input
          type="file"
          name="imageUpload"
          id="imageUpload"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-[var(--brand-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand-header-bg)]/10 file:text-[var(--brand-header-bg)] hover:file:bg-[var(--brand-header-bg)]/20 cursor-pointer"
        />
        {previewUrl && selectedFile && (
          <div className="mt-4">
            <p className="text-sm text-[var(--brand-text-secondary)]">Preview:</p>
            <img src={previewUrl} alt={selectedFile.name} className="mt-2 rounded-md max-h-48 border border-gray-300" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
      </button>
    </form>
  );
};

export default ReportForm;