import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TravelInfo, ProfessionalInfo, FinancialInfo, GoalsInfo } from "@/types/forms";

// Interface para o tipo de dados do formulário
export interface VisaMatchFormData {
  travel_info: Partial<TravelInfo>;
  professional_info: Partial<ProfessionalInfo>;
  financial_info: Partial<FinancialInfo>;
  goals_info: Partial<GoalsInfo>;
}

interface StepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  getFieldState: (field: string) => any;
  getValidationSuggestions: (field: string) => string[];
  validationSummary: any;
}

// Componente para a primeira etapa - Objetivo
const VisaMatchStep1 = () => {
  const { control, watch } = useFormContext<any>();
  const purpose = watch('travel_info.purpose');

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Qual é o seu principal objetivo nos EUA?</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="travel_info.purpose"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                    <RadioGroupItem value="work" id="purpose-work" />
                    <Label htmlFor="purpose-work" className="font-normal cursor-pointer">
                      Trabalhar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                    <RadioGroupItem value="study" id="purpose-study" />
                    <Label htmlFor="purpose-study" className="font-normal cursor-pointer">
                      Estudar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                    <RadioGroupItem value="investment" id="purpose-invest" />
                    <Label htmlFor="purpose-invest" className="font-normal cursor-pointer">
                      Investir/Empreender
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                    <RadioGroupItem value="family" id="purpose-family" />
                    <Label htmlFor="purpose-family" className="font-normal cursor-pointer">
                      Reunificação Familiar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                    <RadioGroupItem value="tourism" id="purpose-visit" />
                    <Label htmlFor="purpose-visit" className="font-normal cursor-pointer">
                      Turismo
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

// Componente para a segunda etapa - Formação e Experiência
const VisaMatchStep3 = () => {
  const { control } = useFormContext<any>();

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Sua Formação e Experiência</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="professional_info.education_level"
          render={({ field }) => (
            <FormItem>
              <Label>Qual é o seu nível de educação?</Label>
              <Select onValueChange={field.onChange} value={field.value as string}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua formação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="high_school">Ensino Médio</SelectItem>
                  <SelectItem value="bachelor">Bacharelado</SelectItem>
                  <SelectItem value="master">Mestrado</SelectItem>
                  <SelectItem value="phd">Doutorado</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="professional_info.years_experience"
          render={({ field }) => (
            <FormItem>
              <Label>Anos de experiência profissional</Label>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua experiência" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">0-2 anos</SelectItem>
                  <SelectItem value="3">3-5 anos</SelectItem>
                  <SelectItem value="6">6-10 anos</SelectItem>
                  <SelectItem value="11">Mais de 10 anos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="professional_info.current_occupation"
          render={({ field }) => (
            <FormItem>
              <Label>Sua ocupação atual</Label>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ex: Engenheiro de Software"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

// Componente para a terceira etapa - Oferta de Emprego
const VisaMatchStep2 = () => {
  const { control, watch } = useFormContext<any>();
  const hasJobOffer = watch('travel_info.has_job_offer');

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Você já tem uma oferta de emprego nos EUA?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="travel_info.has_job_offer"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === 'true')}
                  value={field.value?.toString()}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                    <RadioGroupItem value="true" id="job-yes" />
                    <Label htmlFor="job-yes" className="font-normal cursor-pointer">
                      Sim, já tenho uma oferta
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                    <RadioGroupItem value="false" id="job-no" />
                    <Label htmlFor="job-no" className="font-normal cursor-pointer">
                      Não tenho oferta
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasJobOffer && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Detalhes da Oferta de Emprego</h4>
            <FormField
              control={control}
              name="professional_info.current_employer"
              render={({ field }) => (
                <FormItem>
                  <Label>Empresa</Label>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Nome da empresa"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="professional_info.annual_income"
              render={({ field }) => (
                <FormItem>
                  <Label>Salário Anual (USD)</Label>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      value={field.value || ''}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ex: 80000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente para a quarta etapa - Investimento e Prazo
const VisaMatchStep4 = () => {
  const { control, watch } = useFormContext<any>();
  const purpose = watch("purpose" as any);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">
          {purpose === 'invest' ? 'Investimento e Prazo' : 'Seus Recursos e Prazo'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="investment"
          render={({ field }) => (
            <FormItem>
              <Label>
                {purpose === 'invest' 
                  ? 'Qual é sua capacidade de investimento?' 
                  : 'Qual é a sua disponibilidade financeira para esse projeto?'}
              </Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Até $50,000</SelectItem>
                  <SelectItem value="medium">$50,000 - $500,000</SelectItem>
                  <SelectItem value="high">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="very-high">Mais de $1,000,000</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="timeline"
          render={({ field }) => (
            <FormItem>
              <Label>Qual é seu prazo desejado para imigrar?</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="immediate">Imediatamente</SelectItem>
                  <SelectItem value="6months">6 meses</SelectItem>
                  <SelectItem value="1year">1 ano</SelectItem>
                  <SelectItem value="2years">2+ anos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export {
  VisaMatchStep1,
  VisaMatchStep2,
  VisaMatchStep3,
  VisaMatchStep4,
};
