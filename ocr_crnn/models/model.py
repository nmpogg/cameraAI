from torch import nn

class CRNN(nn.Module):
    def __init__(self, img_h=48, n_channels=1, n_classes=37):
        super(CRNN, self).__init__()

        self.cnn = nn.Sequential(
            # First block
            nn.Conv2d(n_channels, 64, 3, 1, 1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),  # 32x160 -> 16x80

            # Second block
            nn.Conv2d(64, 128, 3, 1, 1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),  # 16x80 -> 8x40

            # Third block (deeper)
            nn.Conv2d(128, 256, 3, 1, 1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, 3, 1, 1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d((2, 1), (2, 1)),  # 8x40 -> 4x40

            # Fourth block
            nn.Conv2d(256, 512, 3, 1, 1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, 1, 1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.Dropout2d(0.3),  # Tăng dropout
            nn.MaxPool2d((2, 1), (2, 1)),  # 4x40 -> 2x40

            # Fifth block (thêm layer)
            nn.Conv2d(512, 512, 3, 1, 1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            nn.MaxPool2d((2, 1), (2, 1)),  # 2x40 -> 1x40
        )

        # LSTM layers - 2 layers để dropout hoạt động
        self.rnn1 = nn.LSTM(512, 256, num_layers=2, bidirectional=True,
                           batch_first=False, dropout=0.3)
        self.rnn2 = nn.LSTM(512, 256, num_layers=2, bidirectional=True,
                           batch_first=False, dropout=0.3)

        # Output layer
        self.fc = nn.Linear(512, n_classes)

        # Initialize weights
        self._initialize_weights()

    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
                if m.bias is not None:
                    nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
                nn.init.constant_(m.bias, 0)

        # LSTM initialization
        for lstm in [self.rnn1, self.rnn2]:
            for name, param in lstm.named_parameters():
                if 'weight_ih' in name:
                    nn.init.xavier_uniform_(param)
                elif 'weight_hh' in name:
                    nn.init.orthogonal_(param)
                elif 'bias' in name:
                    nn.init.constant_(param, 0)

    def forward(self, x):
        # CNN features
        x = self.cnn(x)

        B, C, H, W = x.size()
        assert H == 1, f"Height must be 1, got {H}"

        # Prepare for RNN: [B, C, H, W] -> [W, B, C]
        x = x.squeeze(2)  # [B, C, W]
        x = x.permute(2, 0, 1)  # [W, B, C]

        # LSTM layers
        x, _ = self.rnn1(x)  # [W, B, 512]
        x, _ = self.rnn2(x)  # [W, B, 512]

        # Output
        T, B, C = x.size()
        x = x.view(T * B, C)
        x = self.fc(x)
        x = x.view(T, B, -1)

        return x