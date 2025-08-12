import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { CriadorSonhosFormData } from '@/types/forms';
import { getFieldSuggestions } from '@/utils/dreamsValidation';

interface StepProps {
  formData: CriadorSonhosFormData;
  updateFormData: (field: keyof CriadorSonhosFormData, value: any) => void;
  getFieldState: (field: keyof CriadorSonhosFormData) => any;
  getValidationSuggestions: (field: keyof CriadorSonhosFormData) => string[];
  validationSummary: any;
}

// Field wrapper component with validation display
const FieldWrapper: React.FC<{
  field: keyof CriadorSonhosFormData;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  getFieldState: (field: keyof CriadorSonhosFormData) => any;
  getValidationSuggestions: (field: keyof CriadorSonhosFormData) => string[];
  formData: CriadorSonhosFormData;
}> = ({ field, label, required, children, getFieldState, getValidationSuggestions, formData }) => {
  const fieldState = getFieldState(field);
  const suggestions = getValidationSuggestions(field);
  // Ensure we pass a string to getFieldSuggestions
  const fieldValue = typeof formData[field] === 'string' 
    ? formData[field] as string 
    : '';
  const customSuggestions = getFieldSuggestions(field, fieldValue);

  return (
    <div className="space-y-2">
      <Label htmlFor={field} className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {fieldState.isValid && (
          <CheckCircle className="w-4 h-4 text-green-500" />
        )}
      </Label>
      
      {children}
      
      {/* Error message */}
      {fieldState.showError && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{fieldState.error}</span>
        </div>
      )}
      
      {/* Suggestions */}
      {(suggestions.length > 0 || customSuggestions.length > 0) && !fieldState.showError && (
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center gap-2 text-blue-600 text-sm">
              <Lightbulb className="w-3 h-3" />
              <span>{suggestion}</span>
            </div>
          ))}
          {customSuggestions.map((suggestion, index) => (
            <div key={`custom-${index}`} className="flex items-center gap-2 text-amber-600 text-sm">
              <Lightbulb className="w-3 h-3" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Step 1: Personal Information
export const PersonalInfoStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  getFieldState, 
  getValidationSuggestions 
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full px-2 sm:px-0">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Vamos começar conhecendo você
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Compartilhe suas informações básicas para personalizarmos sua jornada
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 w-full">
        <FieldWrapper
          field="nome"
          label="Nome completo"
          required
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Input
            id="nome"
            value={formData.nome || ''}
            onChange={(e) => updateFormData('nome', e.target.value)}
            placeholder="Digite seu nome completo"
            className="w-full"
          />
        </FieldWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWrapper
            field="idade"
            label="Idade"
            required
            getFieldState={getFieldState}
            getValidationSuggestions={getValidationSuggestions}
            formData={formData}
          >
            <Input
              id="idade"
              type="number"
              min="18"
              max="80"
              value={formData.idade || ''}
              onChange={(e) => updateFormData('idade', parseInt(e.target.value) || '')}
              placeholder="Sua idade"
              className="w-full"
            />
          </FieldWrapper>

          <FieldWrapper
            field="profissao"
            label="Profissão atual"
            required
            getFieldState={getFieldState}
            getValidationSuggestions={getValidationSuggestions}
            formData={formData}
          >
            <Input
              id="profissao"
              value={formData.profissao || ''}
              onChange={(e) => updateFormData('profissao', e.target.value)}
              placeholder="Ex: Engenheiro, Médico, Professor..."
              className="w-full"
            />
          </FieldWrapper>
        </div>

        <FieldWrapper
          field="experiencia"
          label="Anos de experiência"
          required
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Select
            value={formData.experiencia || ''}
            onValueChange={(value) => updateFormData('experiencia', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione seus anos de experiência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0-2 anos</SelectItem>
              <SelectItem value="3-5">3-5 anos</SelectItem>
              <SelectItem value="6-10">6-10 anos</SelectItem>
              <SelectItem value="11-15">11-15 anos</SelectItem>
              <SelectItem value="16+">Mais de 16 anos</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>
      </div>
    </div>
  );
};

// Step 2: Goals and Objectives
export const GoalsStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  getFieldState, 
  getValidationSuggestions 
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Seus objetivos e sonhos
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Conte-nos sobre seus planos e aspirações para o futuro
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <FieldWrapper
          field="objetivo_principal"
          label="Objetivo principal"
          required
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="objetivo_principal"
            value={formData.objetivo_principal || ''}
            onChange={(e) => updateFormData('objetivo_principal', e.target.value)}
            placeholder="Descreva seu principal objetivo ou sonho..."
            className="w-full min-h-[100px]"
            rows={4}
          />
        </FieldWrapper>

        <FieldWrapper
          field="timeline"
          label="Prazo desejado"
          required
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Select
            value={formData.timeline || ''}
            onValueChange={(value) => updateFormData('timeline', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Em quanto tempo você quer alcançar isso?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6-meses">Até 6 meses</SelectItem>
              <SelectItem value="1-ano">1 ano</SelectItem>
              <SelectItem value="2-anos">2 anos</SelectItem>
              <SelectItem value="3-5-anos">3-5 anos</SelectItem>
              <SelectItem value="5+-anos">Mais de 5 anos</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>

        <FieldWrapper
          field="motivacao"
          label="O que te motiva?"
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="motivacao"
            value={formData.motivacao || ''}
            onChange={(e) => updateFormData('motivacao', e.target.value)}
            placeholder="Compartilhe o que te inspira e motiva..."
            className="w-full min-h-[80px]"
            rows={3}
          />
        </FieldWrapper>
      </div>
    </div>
  );
};

// Step 3: Current Situation
export const CurrentSituationStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  getFieldState, 
  getValidationSuggestions 
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Situação atual
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Vamos entender onde você está agora para traçar o melhor caminho
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <FieldWrapper
          field="situacao_atual"
          label="Descreva sua situação atual"
          required
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="situacao_atual"
            value={formData.situacao_atual || ''}
            onChange={(e) => updateFormData('situacao_atual', e.target.value)}
            placeholder="Como está sua vida profissional e pessoal atualmente?"
            className="w-full min-h-[100px]"
            rows={4}
          />
        </FieldWrapper>

        <FieldWrapper
          field="principais_desafios"
          label="Principais desafios"
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="principais_desafios"
            value={formData.principais_desafios || ''}
            onChange={(e) => updateFormData('principais_desafios', e.target.value)}
            placeholder="Quais são os maiores obstáculos que você enfrenta?"
            className="w-full min-h-[80px]"
            rows={3}
          />
        </FieldWrapper>

        <FieldWrapper
          field="recursos_disponiveis"
          label="Recursos disponíveis"
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="recursos_disponiveis"
            value={formData.recursos_disponiveis || ''}
            onChange={(e) => updateFormData('recursos_disponiveis', e.target.value)}
            placeholder="Que recursos você tem disponíveis? (tempo, dinheiro, conhecimentos, etc.)"
            className="w-full min-h-[80px]"
            rows={3}
          />
        </FieldWrapper>
      </div>
    </div>
  );
};

// Step 4: Specific Details
export const SpecificDetailsStep: React.FC<StepProps> = ({ 
  formData, 
  updateFormData, 
  getFieldState, 
  getValidationSuggestions 
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Detalhes específicos
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Informações adicionais para personalizar ainda mais sua jornada
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <FieldWrapper
          field="preferencias"
          label="Preferências e interesses"
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="preferencias"
            value={formData.preferencias || ''}
            onChange={(e) => updateFormData('preferencias', e.target.value)}
            placeholder="Conte sobre seus hobbies, interesses e preferências..."
            className="w-full min-h-[80px]"
            rows={3}
          />
        </FieldWrapper>

        <FieldWrapper
          field="experiencias_anteriores"
          label="Experiências anteriores relevantes"
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="experiencias_anteriores"
            value={formData.experiencias_anteriores || ''}
            onChange={(e) => updateFormData('experiencias_anteriores', e.target.value)}
            placeholder="Experiências passadas que podem ser relevantes para seus objetivos..."
            className="w-full min-h-[80px]"
            rows={3}
          />
        </FieldWrapper>

        <FieldWrapper
          field="observacoes_adicionais"
          label="Observações adicionais"
          getFieldState={getFieldState}
          getValidationSuggestions={getValidationSuggestions}
          formData={formData}
        >
          <Textarea
            id="observacoes_adicionais"
            value={formData.observacoes_adicionais || ''}
            onChange={(e) => updateFormData('observacoes_adicionais', e.target.value)}
            placeholder="Algo mais que gostaria de compartilhar?"
            className="w-full min-h-[80px]"
            rows={3}
          />
        </FieldWrapper>
      </div>
    </div>
  );
};
