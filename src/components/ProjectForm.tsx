import { useProject } from '../context/ProjectContext';
import { Field, TextInput, Button, Card, SectionTitle } from './ui';
import { Save, Building2, User, MapPin, Calendar, Hash, Briefcase } from 'lucide-react';

export function ProjectForm() {
  const { current, updateMeta, saveStatus, forceSave } = useProject();
  if (!current) return null;

  const statusText = {
    idle: '',
    saving: 'Sauvegarde en cours...',
    saved: 'Sauvegarde automatique',
    error: 'Erreur de sauvegarde',
  };

  const statusColor = {
    idle: 'text-slate-400',
    saving: 'text-warning-500',
    saved: 'text-success-500',
    error: 'text-error-500',
  };

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Building2 className="w-5 h-5" />}
        title="Informations du projet"
        subtitle="Identification et suivi du projet"
        action={
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${statusColor[saveStatus]}`}>{statusText[saveStatus]}</span>
            <Button size="sm" variant="secondary" onClick={forceSave}>
              <Save className="w-3.5 h-3.5" /> Sauvegarder
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-2 lg:col-span-1">
          <Field label="Nom du projet">
            <TextInput value={current.name} onChange={(e) => updateMeta({ name: e.target.value })} placeholder="Nom du projet" />
          </Field>
        </div>
        <Field label="Client">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <TextInput className="pl-9" value={current.client} onChange={(e) => updateMeta({ client: e.target.value })} placeholder="Nom du client" />
          </div>
        </Field>
        <Field label="Societe">
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <TextInput className="pl-9" value={current.company} onChange={(e) => updateMeta({ company: e.target.value })} placeholder="Societe" />
          </div>
        </Field>
        <Field label="Localisation">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <TextInput className="pl-9" value={current.location} onChange={(e) => updateMeta({ location: e.target.value })} placeholder="Ville, pays" />
          </div>
        </Field>
        <Field label="Reference projet">
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <TextInput className="pl-9" value={current.reference} onChange={(e) => updateMeta({ reference: e.target.value })} placeholder="REF-2025-001" />
          </div>
        </Field>
        <Field label="Date">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <TextInput className="pl-9" type="date" value={current.project_date} onChange={(e) => updateMeta({ date: e.target.value })} />
          </div>
        </Field>
        <Field label="Ingenieur">
          <TextInput value={current.engineer} onChange={(e) => updateMeta({ engineer: e.target.value })} placeholder="Nom de l'ingenieur" />
        </Field>
      </div>
    </Card>
  );
}
