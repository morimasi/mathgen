
import React, { useState } from 'react';
import { PlaceValueSettings, PlaceValueProblemType, RoundingPlace } from '../types';
import { useProblemGenerator } from '../hooks/useProblemGenerator';
import { generatePlaceValueProblem } from '../services/placeValueService';
import Select from '../components/form/Select';
import NumberInput from '../components/form/NumberInput';
import Checkbox from '../components/form/Checkbox';
import Button from '../components/form/Button';
import SettingsPresetManager from '../components/SettingsPresetManager';

const initialSettings: PlaceValueSettings = {
    gradeLevel: 2,
    type: PlaceValueProblemType.Identification,
    digits: 3,
    roundingPlace: 'auto',
    problemsPerPage: 20,
    pageCount: 1,
    useWordProblems: false, // Not typically used for this module, but kept for consistency
    topic: '',
    autoFit: true,
};

const PlaceValueModule: React.FC = () => {
    const [settings, setSettings] = useState<PlaceValueSettings>(initialSettings);

    const { generate } = useProblemGenerator({
        moduleKey: 'place-value',
        settings,
        generatorFn: generatePlaceValueProblem,
    });

    const handleGenerateClick = () => {
        generate(true);
    };

    const isRounding = settings.type === PlaceValueProblemType.Rounding;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Problem Türü"
                    id="pv-type"
                    value={settings.type}
                    onChange={e => setSettings({ ...settings, type: e.target.value as PlaceValueProblemType })}
                    options={[
                        { value: PlaceValueProblemType.Identification, label: 'Basamak Değeri Bulma' },
                        { value: PlaceValueProblemType.Rounding, label: 'Yuvarlama' },
                        { value: PlaceValueProblemType.ExpandedForm, label: 'Çözümleme' },
                        { value: PlaceValueProblemType.FromExpanded, label: 'Çözümlenmiş Sayıyı Bulma' },
                        { value: PlaceValueProblemType.WriteInWords, label: 'Yazıyla Yazma' },
                        { value: PlaceValueProblemType.WordsToNumber, label: 'Okunuşu Verilen Sayıyı Yazma' },
                        { value: PlaceValueProblemType.Comparison, label: 'Karşılaştırma' },
                        { value: PlaceValueProblemType.ResultAsWords, label: 'Sonucu Yazıyla Yazma' },
                    ]}
                    containerClassName="col-span-2"
                />
                
                <NumberInput
                    label="Basamak Sayısı"
                    id="pv-digits"
                    value={settings.digits}
                    onChange={e => setSettings({ ...settings, digits: parseInt(e.target.value, 10) })}
                    min={1} max={7}
                    containerClassName="col-span-2"
                />

                {isRounding && (
                    <Select
                        label="Yuvarlanacak Basamak"
                        id="pv-roundingPlace"
                        value={settings.roundingPlace}
                        onChange={e => setSettings({ ...settings, roundingPlace: e.target.value as RoundingPlace })}
                        options={[
                            { value: 'auto', label: 'Otomatik' },
                            { value: 'tens', label: 'Onlar' },
                            { value: 'hundreds', label: 'Yüzler' },
                            { value: 'thousands', label: 'Binler' },
                        ]}
                        containerClassName="col-span-2"
                        disabled={settings.digits < 2}
                    />
                )}

                <Checkbox
                    label="Otomatik Sığdır"
                    id="pv-autofit"
                    checked={!!settings.autoFit}
                    onChange={e => setSettings({ ...settings, autoFit: e.target.checked })}
                    containerClassName="col-span-2"
                />
            </div>
             {!settings.autoFit && (
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Sayfa Başına Problem"
                        id="pv-problemsPerPage"
                        value={settings.problemsPerPage}
                        onChange={e => setSettings({ ...settings, problemsPerPage: parseInt(e.target.value, 10) })}
                        min={1} max={100}
                    />
                    <NumberInput
                        label="Sayfa Sayısı"
                        id="pv-pageCount"
                        value={settings.pageCount}
                        onChange={e => setSettings({ ...settings, pageCount: parseInt(e.target.value, 10) })}
                        min={1} max={20}
                    />
                </div>
            )}
            
            <SettingsPresetManager<PlaceValueSettings>
                moduleKey="placeValue"
                currentSettings={settings}
                onLoadSettings={setSettings}
                initialSettings={initialSettings}
            />

            <Button onClick={handleGenerateClick} className="w-full" enableFlyingLadybug>
                Çalışma Kağıdı Oluştur
            </Button>
        </div>
    );
};

export default PlaceValueModule;
