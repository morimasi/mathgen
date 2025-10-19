import React, { useState, useCallback } from 'react';
import { generateReadinessProblem } from '../services/readinessService.ts';
import { generateContextualWordProblems } from '../services/geminiService.ts';
import { SimpleGraphsSettings, SimpleGraphType, MathReadinessTheme, SimpleGraphTaskType } from '../types.ts';
import Button from '../components/form/Button.tsx';
import NumberInput from '../components/form/NumberInput.tsx';
import Select from '../components/form/Select.tsx';
import Checkbox from '../components/form/Checkbox.tsx';
import TextInput from '../components/form/TextInput.tsx';
import { ShuffleIcon } from '../components/icons/Icons.tsx';
import { usePrintSettings } from '../services/PrintSettingsContext.tsx';
import SettingsPresetManager from '../components/SettingsPresetManager.tsx';
import { TOPIC_SUGGESTIONS } from '../constants.ts';
import HintButton from '../components/HintButton.tsx';
import { useProblemGenerator } from '../hooks/useProblemGenerator.ts';

