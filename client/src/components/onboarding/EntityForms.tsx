/**
 * Entity-Specific Onboarding Forms
 * 
 * Forms for INDIVIDUAL, COMPANY, TRUST, and SMSF entity types.
 * Aligned with onboarding_v2 domain from TuringCore-v3.
 * 
 * RULES:
 * - No advice, recommendations, or guidance
 * - No quizzes, rankings, or suitability assessments
 * - Explicit confirmation: "I confirm this information is correct"
 * - Full transparency of data being collected
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Plus, Trash2, User, Building2, FileText, Landmark } from 'lucide-react';
import type {
  LegalEntityType,
  NaturalPerson,
  RelationshipRole,
  TrusteeModel,
  Address,
} from '@/contracts/onboarding';

// =============================================================================
// SHARED TYPES
// =============================================================================

interface PersonFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone?: string;
  address?: Partial<Address>;
  taxResidency?: string;
}

interface RelationshipFormData {
  personIndex: number;
  role: RelationshipRole;
  ownershipPercent?: number;
  isControllingPerson: boolean;
}

// =============================================================================
// INDIVIDUAL FORM
// =============================================================================

interface IndividualFormProps {
  onSubmit: (data: { person: PersonFormData; confirmed: boolean }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function IndividualForm({ onSubmit, onCancel, isSubmitting }: IndividualFormProps) {
  const [person, setPerson] = useState<PersonFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
  });
  const [confirmed, setConfirmed] = useState(false);

  const isValid = person.firstName && person.lastName && person.dateOfBirth && person.email && confirmed;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <CardTitle>Individual Account</CardTitle>
            <CardDescription>Personal details for the account holder</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={person.firstName}
              onChange={(e) => setPerson({ ...person, firstName: e.target.value })}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={person.lastName}
              onChange={(e) => setPerson({ ...person, lastName: e.target.value })}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={person.dateOfBirth}
              onChange={(e) => setPerson({ ...person, dateOfBirth: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={person.email}
              onChange={(e) => setPerson({ ...person, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={person.phone || ''}
            onChange={(e) => setPerson({ ...person, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>

        <Separator />

        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border">
          <Checkbox
            id="confirm"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="confirm" className="font-medium cursor-pointer">
              I confirm this information is correct
            </Label>
            <p className="text-sm text-slate-500">
              By checking this box, you confirm that the information provided is accurate and complete.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={() => onSubmit({ person, confirmed })} disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// =============================================================================
// COMPANY FORM
// =============================================================================

interface CompanyFormProps {
  onSubmit: (data: {
    companyName: string;
    abn: string;
    acn?: string;
    directors: PersonFormData[];
    beneficialOwners: PersonFormData[];
    authorisedRep?: PersonFormData;
    confirmed: boolean;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CompanyForm({ onSubmit, onCancel, isSubmitting }: CompanyFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [abn, setAbn] = useState('');
  const [acn, setAcn] = useState('');
  const [directors, setDirectors] = useState<PersonFormData[]>([createEmptyPerson()]);
  const [beneficialOwners, setBeneficialOwners] = useState<PersonFormData[]>([]);
  const [hasAuthorisedRep, setHasAuthorisedRep] = useState(false);
  const [authorisedRep, setAuthorisedRep] = useState<PersonFormData>(createEmptyPerson());
  const [confirmed, setConfirmed] = useState(false);

  const isValid = companyName && abn && directors.length > 0 && 
    directors.every(d => d.firstName && d.lastName && d.email) && confirmed;

  const addDirector = () => setDirectors([...directors, createEmptyPerson()]);
  const removeDirector = (index: number) => {
    if (directors.length > 1) {
      setDirectors(directors.filter((_, i) => i !== index));
    }
  };

  const addBeneficialOwner = () => setBeneficialOwners([...beneficialOwners, createEmptyPerson()]);
  const removeBeneficialOwner = (index: number) => {
    setBeneficialOwners(beneficialOwners.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <CardTitle>Company Account</CardTitle>
            <CardDescription>Company details, directors, and beneficial owners</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Details */}
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-4">Company Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abn">ABN *</Label>
              <Input
                id="abn"
                value={abn}
                onChange={(e) => setAbn(e.target.value)}
                placeholder="XX XXX XXX XXX"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="acn">ACN (Optional)</Label>
            <Input
              id="acn"
              value={acn}
              onChange={(e) => setAcn(e.target.value)}
              placeholder="XXX XXX XXX"
            />
          </div>
        </div>

        <Separator />

        {/* Directors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900">Directors *</h3>
            <Button variant="outline" size="sm" onClick={addDirector}>
              <Plus className="w-4 h-4 mr-1" /> Add Director
            </Button>
          </div>
          <div className="space-y-4">
            {directors.map((director, index) => (
              <PersonFieldset
                key={index}
                label={`Director ${index + 1}`}
                person={director}
                onChange={(updated) => {
                  const newDirectors = [...directors];
                  newDirectors[index] = updated;
                  setDirectors(newDirectors);
                }}
                onRemove={directors.length > 1 ? () => removeDirector(index) : undefined}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Beneficial Owners */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-slate-900">Beneficial Owners</h3>
              <p className="text-xs text-slate-500 mt-1">Persons with 25% or more ownership</p>
            </div>
            <Button variant="outline" size="sm" onClick={addBeneficialOwner}>
              <Plus className="w-4 h-4 mr-1" /> Add Owner
            </Button>
          </div>
          {beneficialOwners.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No beneficial owners added</p>
          ) : (
            <div className="space-y-4">
              {beneficialOwners.map((owner, index) => (
                <PersonFieldset
                  key={index}
                  label={`Beneficial Owner ${index + 1}`}
                  person={owner}
                  onChange={(updated) => {
                    const newOwners = [...beneficialOwners];
                    newOwners[index] = updated;
                    setBeneficialOwners(newOwners);
                  }}
                  onRemove={() => removeBeneficialOwner(index)}
                />
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Authorised Representative */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Checkbox
              id="hasAuthorisedRep"
              checked={hasAuthorisedRep}
              onCheckedChange={(checked) => setHasAuthorisedRep(checked === true)}
            />
            <Label htmlFor="hasAuthorisedRep" className="cursor-pointer">
              Add Authorised Representative
            </Label>
          </div>
          {hasAuthorisedRep && (
            <PersonFieldset
              label="Authorised Representative"
              person={authorisedRep}
              onChange={setAuthorisedRep}
            />
          )}
        </div>

        <Separator />

        <ConfirmationCheckbox confirmed={confirmed} setConfirmed={setConfirmed} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Back
        </Button>
        <Button 
          onClick={() => onSubmit({ 
            companyName, 
            abn, 
            acn: acn || undefined, 
            directors, 
            beneficialOwners, 
            authorisedRep: hasAuthorisedRep ? authorisedRep : undefined,
            confirmed 
          })} 
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// =============================================================================
// TRUST FORM
// =============================================================================

interface TrustFormProps {
  onSubmit: (data: {
    trustName: string;
    abn: string;
    trustType: string;
    trusteeModel: TrusteeModel;
    corporateTrustee?: { companyName: string; abn: string };
    individualTrustees?: PersonFormData[];
    appointer?: PersonFormData;
    settlor?: PersonFormData;
    authorisedRep?: PersonFormData;
    confirmed: boolean;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TrustForm({ onSubmit, onCancel, isSubmitting }: TrustFormProps) {
  const [trustName, setTrustName] = useState('');
  const [abn, setAbn] = useState('');
  const [trustType, setTrustType] = useState('');
  const [trusteeModel, setTrusteeModel] = useState<TrusteeModel>('INDIVIDUAL_TRUSTEES');
  const [corporateTrustee, setCorporateTrustee] = useState({ companyName: '', abn: '' });
  const [individualTrustees, setIndividualTrustees] = useState<PersonFormData[]>([createEmptyPerson()]);
  const [hasAppointer, setHasAppointer] = useState(false);
  const [appointer, setAppointer] = useState<PersonFormData>(createEmptyPerson());
  const [hasSettlor, setHasSettlor] = useState(false);
  const [settlor, setSettlor] = useState<PersonFormData>(createEmptyPerson());
  const [hasAuthorisedRep, setHasAuthorisedRep] = useState(false);
  const [authorisedRep, setAuthorisedRep] = useState<PersonFormData>(createEmptyPerson());
  const [confirmed, setConfirmed] = useState(false);

  const isValid = trustName && abn && trustType && confirmed && (
    trusteeModel === 'CORPORATE_TRUSTEE' 
      ? corporateTrustee.companyName && corporateTrustee.abn
      : individualTrustees.length > 0 && individualTrustees.every(t => t.firstName && t.lastName && t.email)
  );

  const addTrustee = () => setIndividualTrustees([...individualTrustees, createEmptyPerson()]);
  const removeTrustee = (index: number) => {
    if (individualTrustees.length > 1) {
      setIndividualTrustees(individualTrustees.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <CardTitle>Trust Account</CardTitle>
            <CardDescription>Trust details, trustees, and related parties</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trust Details */}
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-4">Trust Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trustName">Trust Name *</Label>
              <Input
                id="trustName"
                value={trustName}
                onChange={(e) => setTrustName(e.target.value)}
                placeholder="Enter trust name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trustAbn">ABN *</Label>
              <Input
                id="trustAbn"
                value={abn}
                onChange={(e) => setAbn(e.target.value)}
                placeholder="XX XXX XXX XXX"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="trustType">Trust Type *</Label>
            <Select value={trustType} onValueChange={setTrustType}>
              <SelectTrigger>
                <SelectValue placeholder="Select trust type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discretionary">Discretionary Trust</SelectItem>
                <SelectItem value="unit">Unit Trust</SelectItem>
                <SelectItem value="hybrid">Hybrid Trust</SelectItem>
                <SelectItem value="fixed">Fixed Trust</SelectItem>
                <SelectItem value="testamentary">Testamentary Trust</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Trustee Model Selection */}
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-4">Trustee Structure *</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-colors ${trusteeModel === 'INDIVIDUAL_TRUSTEES' ? 'border-slate-900' : 'hover:border-slate-400'}`}
              onClick={() => setTrusteeModel('INDIVIDUAL_TRUSTEES')}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Individual Trustees</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Natural persons act as trustees</p>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer transition-colors ${trusteeModel === 'CORPORATE_TRUSTEE' ? 'border-slate-900' : 'hover:border-slate-400'}`}
              onClick={() => setTrusteeModel('CORPORATE_TRUSTEE')}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">Corporate Trustee</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">A company acts as trustee</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Trustees */}
        {trusteeModel === 'CORPORATE_TRUSTEE' ? (
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-4">Corporate Trustee Details *</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corpTrusteeName">Company Name *</Label>
                <Input
                  id="corpTrusteeName"
                  value={corporateTrustee.companyName}
                  onChange={(e) => setCorporateTrustee({ ...corporateTrustee, companyName: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="corpTrusteeAbn">ABN *</Label>
                <Input
                  id="corpTrusteeAbn"
                  value={corporateTrustee.abn}
                  onChange={(e) => setCorporateTrustee({ ...corporateTrustee, abn: e.target.value })}
                  placeholder="XX XXX XXX XXX"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-900">Individual Trustees *</h3>
              <Button variant="outline" size="sm" onClick={addTrustee}>
                <Plus className="w-4 h-4 mr-1" /> Add Trustee
              </Button>
            </div>
            <div className="space-y-4">
              {individualTrustees.map((trustee, index) => (
                <PersonFieldset
                  key={index}
                  label={`Trustee ${index + 1}`}
                  person={trustee}
                  onChange={(updated) => {
                    const newTrustees = [...individualTrustees];
                    newTrustees[index] = updated;
                    setIndividualTrustees(newTrustees);
                  }}
                  onRemove={individualTrustees.length > 1 ? () => removeTrustee(index) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Optional Parties */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox id="hasAppointer" checked={hasAppointer} onCheckedChange={(c) => setHasAppointer(c === true)} />
            <Label htmlFor="hasAppointer" className="cursor-pointer">Add Appointer</Label>
          </div>
          {hasAppointer && <PersonFieldset label="Appointer" person={appointer} onChange={setAppointer} />}

          <div className="flex items-center gap-3">
            <Checkbox id="hasSettlor" checked={hasSettlor} onCheckedChange={(c) => setHasSettlor(c === true)} />
            <Label htmlFor="hasSettlor" className="cursor-pointer">Add Settlor</Label>
          </div>
          {hasSettlor && <PersonFieldset label="Settlor" person={settlor} onChange={setSettlor} />}

          <div className="flex items-center gap-3">
            <Checkbox id="hasAuthRepTrust" checked={hasAuthorisedRep} onCheckedChange={(c) => setHasAuthorisedRep(c === true)} />
            <Label htmlFor="hasAuthRepTrust" className="cursor-pointer">Add Authorised Representative</Label>
          </div>
          {hasAuthorisedRep && <PersonFieldset label="Authorised Representative" person={authorisedRep} onChange={setAuthorisedRep} />}
        </div>

        <Separator />

        <ConfirmationCheckbox confirmed={confirmed} setConfirmed={setConfirmed} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Back</Button>
        <Button 
          onClick={() => onSubmit({ 
            trustName, 
            abn, 
            trustType, 
            trusteeModel,
            corporateTrustee: trusteeModel === 'CORPORATE_TRUSTEE' ? corporateTrustee : undefined,
            individualTrustees: trusteeModel === 'INDIVIDUAL_TRUSTEES' ? individualTrustees : undefined,
            appointer: hasAppointer ? appointer : undefined,
            settlor: hasSettlor ? settlor : undefined,
            authorisedRep: hasAuthorisedRep ? authorisedRep : undefined,
            confirmed 
          })} 
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// =============================================================================
// SMSF FORM
// =============================================================================

interface SMSFFormProps {
  onSubmit: (data: {
    fundName: string;
    abn: string;
    trusteeModel: TrusteeModel;
    corporateTrustee?: { companyName: string; abn: string };
    individualTrustees?: PersonFormData[];
    members: PersonFormData[];
    authorisedRep?: PersonFormData;
    confirmed: boolean;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SMSFForm({ onSubmit, onCancel, isSubmitting }: SMSFFormProps) {
  const [fundName, setFundName] = useState('');
  const [abn, setAbn] = useState('');
  const [trusteeModel, setTrusteeModel] = useState<TrusteeModel>('INDIVIDUAL_TRUSTEES');
  const [corporateTrustee, setCorporateTrustee] = useState({ companyName: '', abn: '' });
  const [individualTrustees, setIndividualTrustees] = useState<PersonFormData[]>([createEmptyPerson()]);
  const [members, setMembers] = useState<PersonFormData[]>([createEmptyPerson()]);
  const [hasAuthorisedRep, setHasAuthorisedRep] = useState(false);
  const [authorisedRep, setAuthorisedRep] = useState<PersonFormData>(createEmptyPerson());
  const [confirmed, setConfirmed] = useState(false);

  const isValid = fundName && abn && confirmed && 
    members.length > 0 && members.every(m => m.firstName && m.lastName && m.email) && (
    trusteeModel === 'CORPORATE_TRUSTEE' 
      ? corporateTrustee.companyName && corporateTrustee.abn
      : individualTrustees.length > 0 && individualTrustees.every(t => t.firstName && t.lastName && t.email)
  );

  const addTrustee = () => setIndividualTrustees([...individualTrustees, createEmptyPerson()]);
  const removeTrustee = (index: number) => {
    if (individualTrustees.length > 1) {
      setIndividualTrustees(individualTrustees.filter((_, i) => i !== index));
    }
  };

  const addMember = () => setMembers([...members, createEmptyPerson()]);
  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <CardTitle>SMSF Account</CardTitle>
            <CardDescription>Self-Managed Super Fund details, trustees, and members</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fund Details */}
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-4">Fund Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fundName">Fund Name *</Label>
              <Input
                id="fundName"
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                placeholder="Enter fund name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smsfAbn">ABN *</Label>
              <Input
                id="smsfAbn"
                value={abn}
                onChange={(e) => setAbn(e.target.value)}
                placeholder="XX XXX XXX XXX"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Trustee Model Selection */}
        <div>
          <h3 className="text-sm font-medium text-slate-900 mb-4">Trustee Structure *</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-colors ${trusteeModel === 'INDIVIDUAL_TRUSTEES' ? 'border-slate-900' : 'hover:border-slate-400'}`}
              onClick={() => setTrusteeModel('INDIVIDUAL_TRUSTEES')}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Individual Trustees</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Members act as trustees</p>
              </CardContent>
            </Card>
            <Card 
              className={`cursor-pointer transition-colors ${trusteeModel === 'CORPORATE_TRUSTEE' ? 'border-slate-900' : 'hover:border-slate-400'}`}
              onClick={() => setTrusteeModel('CORPORATE_TRUSTEE')}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">Corporate Trustee</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">A company acts as trustee</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Trustees */}
        {trusteeModel === 'CORPORATE_TRUSTEE' ? (
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-4">Corporate Trustee Details *</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smsfCorpName">Company Name *</Label>
                <Input
                  id="smsfCorpName"
                  value={corporateTrustee.companyName}
                  onChange={(e) => setCorporateTrustee({ ...corporateTrustee, companyName: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsfCorpAbn">ABN *</Label>
                <Input
                  id="smsfCorpAbn"
                  value={corporateTrustee.abn}
                  onChange={(e) => setCorporateTrustee({ ...corporateTrustee, abn: e.target.value })}
                  placeholder="XX XXX XXX XXX"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-900">Individual Trustees *</h3>
              <Button variant="outline" size="sm" onClick={addTrustee}>
                <Plus className="w-4 h-4 mr-1" /> Add Trustee
              </Button>
            </div>
            <div className="space-y-4">
              {individualTrustees.map((trustee, index) => (
                <PersonFieldset
                  key={index}
                  label={`Trustee ${index + 1}`}
                  person={trustee}
                  onChange={(updated) => {
                    const newTrustees = [...individualTrustees];
                    newTrustees[index] = updated;
                    setIndividualTrustees(newTrustees);
                  }}
                  onRemove={individualTrustees.length > 1 ? () => removeTrustee(index) : undefined}
                />
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Members */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900">Fund Members *</h3>
            <Button variant="outline" size="sm" onClick={addMember}>
              <Plus className="w-4 h-4 mr-1" /> Add Member
            </Button>
          </div>
          <div className="space-y-4">
            {members.map((member, index) => (
              <PersonFieldset
                key={index}
                label={`Member ${index + 1}`}
                person={member}
                onChange={(updated) => {
                  const newMembers = [...members];
                  newMembers[index] = updated;
                  setMembers(newMembers);
                }}
                onRemove={members.length > 1 ? () => removeMember(index) : undefined}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Authorised Representative */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Checkbox id="hasAuthRepSmsf" checked={hasAuthorisedRep} onCheckedChange={(c) => setHasAuthorisedRep(c === true)} />
            <Label htmlFor="hasAuthRepSmsf" className="cursor-pointer">Add Authorised Representative</Label>
          </div>
          {hasAuthorisedRep && <PersonFieldset label="Authorised Representative" person={authorisedRep} onChange={setAuthorisedRep} />}
        </div>

        <Separator />

        <ConfirmationCheckbox confirmed={confirmed} setConfirmed={setConfirmed} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Back</Button>
        <Button 
          onClick={() => onSubmit({ 
            fundName, 
            abn, 
            trusteeModel,
            corporateTrustee: trusteeModel === 'CORPORATE_TRUSTEE' ? corporateTrustee : undefined,
            individualTrustees: trusteeModel === 'INDIVIDUAL_TRUSTEES' ? individualTrustees : undefined,
            members,
            authorisedRep: hasAuthorisedRep ? authorisedRep : undefined,
            confirmed 
          })} 
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

function createEmptyPerson(): PersonFormData {
  return {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
  };
}

interface PersonFieldsetProps {
  label: string;
  person: PersonFormData;
  onChange: (person: PersonFormData) => void;
  onRemove?: () => void;
}

function PersonFieldset({ label, person, onChange, onRemove }: PersonFieldsetProps) {
  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="w-4 h-4 text-slate-400" />
          </Button>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">First Name *</Label>
          <Input
            value={person.firstName}
            onChange={(e) => onChange({ ...person, firstName: e.target.value })}
            placeholder="First name"
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Last Name *</Label>
          <Input
            value={person.lastName}
            onChange={(e) => onChange({ ...person, lastName: e.target.value })}
            placeholder="Last name"
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Date of Birth</Label>
          <Input
            type="date"
            value={person.dateOfBirth}
            onChange={(e) => onChange({ ...person, dateOfBirth: e.target.value })}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Email *</Label>
          <Input
            type="email"
            value={person.email}
            onChange={(e) => onChange({ ...person, email: e.target.value })}
            placeholder="Email address"
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}

interface ConfirmationCheckboxProps {
  confirmed: boolean;
  setConfirmed: (confirmed: boolean) => void;
}

function ConfirmationCheckbox({ confirmed, setConfirmed }: ConfirmationCheckboxProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border">
      <Checkbox
        id="confirmEntity"
        checked={confirmed}
        onCheckedChange={(checked) => setConfirmed(checked === true)}
      />
      <div className="space-y-1">
        <Label htmlFor="confirmEntity" className="font-medium cursor-pointer">
          I confirm this information is correct
        </Label>
        <p className="text-sm text-slate-500">
          By checking this box, you confirm that the information provided is accurate and complete.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// ENTITY TYPE SELECTOR
// =============================================================================

interface EntityTypeSelectorProps {
  onSelect: (entityType: LegalEntityType) => void;
  onCancel: () => void;
}

export function EntityTypeSelector({ onSelect, onCancel }: EntityTypeSelectorProps) {
  const entityTypes: { type: LegalEntityType; icon: typeof User; title: string; description: string }[] = [
    { type: 'INDIVIDUAL', icon: User, title: 'Individual', description: 'Personal account for a single person' },
    { type: 'COMPANY', icon: Building2, title: 'Company', description: 'Account for a registered company' },
    { type: 'TRUST', icon: FileText, title: 'Trust', description: 'Account for a discretionary or unit trust' },
    { type: 'SMSF', icon: Landmark, title: 'SMSF', description: 'Self-Managed Superannuation Fund' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Entity Type</CardTitle>
        <CardDescription>Choose the legal structure for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {entityTypes.map(({ type, icon: Icon, title, description }) => (
            <Card 
              key={type}
              className="cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => onSelect(type)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onCancel}>Back</Button>
      </CardFooter>
    </Card>
  );
}
