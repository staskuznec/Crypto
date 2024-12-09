import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {Crypto, CryptoHistory} from '../../interfaces/crypto';
import { CoinMarketCapService } from '../../services/coinmarketcap.service';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {ConverterCurrencyHistoryService} from '../../services/converter-currency-history.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    NgForOf,
    MatIcon,
    NgIf,
  ]
})
export class ConverterComponent implements OnInit, OnDestroy {
  conversionForm: FormGroup;
  cryptocurrencies: Crypto[] = [];
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private cms: CoinMarketCapService, private cch: ConverterCurrencyHistoryService) {
    this.conversionForm = this.fb.group({
      fromCurrency: ['', Validators.required],
      toCurrency: ['', Validators.required],
      fromAmount: ['', [Validators.required, Validators.min(0)]],
      toAmount: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cms.cryptocurrencies$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
      this.cryptocurrencies = data;
    });
    this.cms.fetchCryptocurrencies();

    this.conversionForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      this.calculateConversion();
    });
  }

  // метод для расчета конвертации
  public calculateConversion(): void {
    // получаем значения из формы
    const { fromCurrency, toCurrency, fromAmount } = this.conversionForm.value;
    // находим криптовалюты в массиве по их символам
    const fromCrypto = this.cryptocurrencies.find(c => c.symbol === fromCurrency);
    // находим криптовалюты в массиве по их символам
    const toCrypto = this.cryptocurrencies.find(c => c.symbol === toCurrency);
    // если все значения есть, то производим расчет
    if (fromCrypto && toCrypto && fromAmount) {
      // расчет конвертации
      const convertedAmount = (fromAmount * fromCrypto.price) / toCrypto.price;
      // устанавливаем значение в поле toAmount
      this.conversionForm.patchValue({ toAmount: convertedAmount }, { emitEvent: false });
      // сохраняем историю конвертации
      this.cch.addFromCurrency(fromCurrency, fromCrypto.logo);
      this.cch.addToCurrency(toCurrency, toCrypto.logo);
    }
  }

  // метод для изменения направления конвертации
  public swapCurrencies(): void {
    const { fromCurrency, toCurrency, fromAmount, toAmount } = this.conversionForm.value;
    this.conversionForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
      fromAmount: toAmount,
      toAmount: fromAmount
    });
  }

  // метод для обновления курсов валют
  public refreshRates(): void {
    this.cms.fetchCryptocurrencies();
  }


  // метод для очистки формы
  public clearForm(): void {
    this.conversionForm.reset();
  }

  // геттеры для получения истории конвертации из какой валюты
  get topFromCurrencies(): CryptoHistory[] {
    return this.cch.getTopFromCurrencies();
  }

  // геттеры для получения истории конвертации в какую валюту
  get topToCurrencies(): CryptoHistory[] {
    return this.cch.getTopToCurrencies();
  }

  // методы для установки валюты в форме From
  public setFromCurrency(currency: string): void {
    this.conversionForm.patchValue({ fromCurrency: currency });
  }

 // методы для установки валюты в форме To
  public setToCurrency(currency: string): void {
    this.conversionForm.patchValue({ toCurrency: currency });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
